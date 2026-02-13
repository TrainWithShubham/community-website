/**
 * Google Sheets Service - Jobs Only
 * 
 * Note: Interview questions have been migrated to GitHub CSV.
 * See src/services/github-csv.ts for interview question data.
 * 
 * This service now only handles Jobs data from Google Sheets.
 */

import { Job } from "@/data/jobs";
import { getSheetUrls } from "@/lib/env";
import Papa from "papaparse";

// Get sheet URLs from environment variables with type safety
const sheetUrls = getSheetUrls();

async function fetchCSV(url: string): Promise<string> {
  if (!url) {
    throw new Error('CSV URL is not configured. Please check your environment variables.');
  }

  try {
    // Use Next.js's default caching for fetched data with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TWS-Community-Hub/1.0',
      },
      redirect: 'follow', // Follow redirects
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Received empty CSV data');
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout while fetching CSV from ${url}`);
      }
      throw new Error(`Failed to fetch CSV from ${url}: ${error.message}`);
    }
    throw new Error(`Unknown error while fetching CSV from ${url}`);
  }
}

/**
 * Fetch job listings from Google Sheets
 */
export async function getJobs(): Promise<Job[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.jobs);
    
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const validData = parsed.data.filter((row: any) => {
      const hasValidData = row.id && row.title && row.company;
      return hasValidData;
    });

    const processedJobs = validData.map((row: any) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      experience: row.experience,
      type: row.type,
      postedDate: row.postedDate,
      applyLink: row.applyLink,
    }));

    return processedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}
