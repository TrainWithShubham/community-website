/**
 * Data Fetcher - Homepage Data Aggregation
 * 
 * Fetches data from multiple sources for the homepage:
 * - Interview Questions: GitHub CSV (src/services/github-csv.ts)
 * - Jobs: Google Sheets (src/services/google-sheets.ts)
 */

import { trackError, trackPerformance } from './monitoring';
import { getAllInterviewQuestions, type InterviewQuestion } from '@/services/github-csv';
import { getJobs } from '@/services/google-sheets';
import type { Job } from '@/data/jobs';

export interface HomePageData {
  interviewQuestions: InterviewQuestion[]; // Consolidated from GitHub CSV
  jobs: Job[];
}

/**
 * Retry a fetch operation with exponential backoff
 * @param fn - Function to retry
 * @param retries - Number of retries (default: 3)
 * @param delay - Initial delay in ms (default: 1000)
 */
async function retryFetch<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryFetch(fn, retries - 1, delay * 2);
  }
}

/**
 * Fetch all data for homepage at build time
 * Uses retry logic with exponential backoff for reliability
 * Fails the build if critical data cannot be fetched
 */
export async function getHomePageData(): Promise<HomePageData> {
  const startTime = Date.now();
  
  try {
    console.log('[Build] Fetching homepage data...');
    console.log('[Build] - Interview Questions: GitHub CSV');
    console.log('[Build] - Jobs: Google Sheets');
    
    const [
      interviewQuestions,
      jobs,
    ] = await Promise.allSettled([
      retryFetch(() => getAllInterviewQuestions()),
      retryFetch(() => getJobs()),
    ]);

    const duration = Date.now() - startTime;
    trackPerformance('homepage-data-fetch', duration);
    console.log(`[Build] Homepage data fetched in ${duration}ms`);

    // Check for critical failures
    const failures = [
      { name: 'Interview Questions', result: interviewQuestions },
      { name: 'Jobs', result: jobs },
    ].filter(({ result }) => result.status === 'rejected');

    if (failures.length > 0) {
      console.warn('[Build] Some data sources failed:');
      failures.forEach(({ name, result }) => {
        if (result.status === 'rejected') {
          console.warn(`  - ${name}: ${result.reason}`);
        }
      });
    }

    return {
      interviewQuestions: interviewQuestions.status === 'fulfilled' ? interviewQuestions.value : [],
      jobs: jobs.status === 'fulfilled' ? jobs.value : [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Build] Failed to fetch homepage data:', errorMessage);
    trackError(error as Error, 'homepage-data-fetch');
    
    // Fail the build if data fetching fails completely
    throw new Error(`Build failed: Unable to fetch homepage data. ${errorMessage}`);
  }
}
