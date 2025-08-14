
import { Question } from "@/data/questions";
import { Contributor } from "@/data/leaderboard";
import { Job } from "@/data/jobs";
import { getSheetUrls } from "@/lib/env";
import Papa from "papaparse";

// Get sheet URLs from environment variables with type safety
const sheetUrls = getSheetUrls();

export type CommunityStats = {
  activeMembers: string;
  activeVolunteers: string;
  successStories: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}


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

function formatAnswerSection(text: string): string {
    if (!text) return '';
    // Split by newline, filter empty lines, wrap in <p>, and join.
    const lines = text.split('\n').filter(line => line.trim() !== '');

    // Check if the text looks like a numbered list
    const isNumberedList = lines.every(line => /^\d+\.\s/.test(line.trim()));

    if (isNumberedList) {
        return `<ol>${lines.map(line => `<li>${line.trim().substring(line.indexOf('.') + 1).trim()}</li>`).join('')}</ol>`;
    }
    
    return lines.map(line => `<p>${line}</p>`).join('');
}


export async function getInterviewQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.interview);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });



    return parsed.data.map((row: any) => {
      const { question, answer, author } = row;
      return {
        question: question || '',
        answer: answer ? formatAnswerSection(answer) : 'Answer not available.',
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    return []; // Return empty array on error
  }
}


export async function getScenarioQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.scenario);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });



    return parsed.data.map((row: any) => {
      const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix, 
        lessonLearned, 
        howToAvoid,
        author,
        answer: legacyAnswer
      } = row;

      let formattedAnswer;

      const parts = [];
      if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
      if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
      if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
      if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
      if (lessonLearned) parts.push(`<h4>Lesson Learned:</h4>${formatAnswerSection(lessonLearned)}`);
      if (howToAvoid) parts.push(`<h4>How to Avoid in Future:</h4>${formatAnswerSection(howToAvoid)}`);
      
      if (parts.length > 0) {
        formattedAnswer = parts.join('');
      } else {
        formattedAnswer = legacyAnswer ? formatAnswerSection(legacyAnswer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    return []; // Return empty array on error
  }
}

export async function getLiveQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.live);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });



    return parsed.data.map((row: any) => {
      const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix,
        author,
        answer
      } = row;

      let formattedAnswer;

      const parts = [];
      if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
      if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
      if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
      if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
      
      if (parts.length > 0) {
        formattedAnswer = parts.join('');
      } else {
        formattedAnswer = answer ? formatAnswerSection(answer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    return [];
  }
}

export async function getCommunityQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.community);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });



    return parsed.data.map((row: any) => {
       const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix, 
        lessonLearned, 
        howToAvoid,
        author,
        answer, // For interview and MCQ questions
        type // To distinguish between question types
      } = row;

      let formattedAnswer;
      const parts = [];

      if (type === 'scenario') {
        if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
        if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
        if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
        if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
        if (lessonLearned) parts.push(`<h4>Lesson Learned:</h4>${formatAnswerSection(lessonLearned)}`);
        if (howToAvoid) parts.push(`<h4>How to Avoid in Future:</h4>${formatAnswerSection(howToAvoid)}`);
        formattedAnswer = parts.join('');
      } else {
        // For interview, mcq, or other types
         formattedAnswer = answer ? formatAnswerSection(answer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    return [];
  }
}

export async function getLeaderboardData(): Promise<Contributor[]> {
  try {
    const csvText = await fetchCSV(sheetUrls.leaderboard);
    
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as string to handle "pts" suffix
    });

    // Filter out rows that are empty or don't have a name.
    const validData = parsed.data.filter((row: any) => {
      const hasValidData = row.name && row.rank && row.contributions;
      return hasValidData;
    });

    const processedData = validData.map((row: any) => {
      // Clean up contributions field - remove "pts" suffix and any trailing characters
      let contributions = row.contributions;
      if (typeof contributions === 'string') {
        // Remove "pts" suffix and any trailing characters like "%"
        contributions = contributions.replace(/\s*pts\s*.*$/i, '').trim();
      }
      
      // Convert to number, default to 0 if invalid
      const contributionsNum = parseInt(contributions) || 0;
      
      const contributor = {
        rank: parseInt(row.rank) || 0,
        name: row.name || 'Anonymous',
        contributions: contributionsNum,
      };
      
      return contributor;
    });

    return processedData;

  } catch (error) {
    return [];
  }
}

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
    return [];
  }
}

export async function getCommunityStats(): Promise<CommunityStats> {
    const defaultStats: CommunityStats = {
        activeMembers: "10k+",
        activeVolunteers: "50+",
        successStories: "200+",
        githubUrl: "#",
        linkedinUrl: "#",
        twitterUrl: "#",
        instagramUrl: "#"
    };

    try {
        const csvText = await fetchCSV(sheetUrls.communityStats);
        
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
            return defaultStats;
        }

        // Get the first row of data (assuming single row)
        const row = parsed.data[0] as any;
        if (!row) {
            return defaultStats;
        }

        // Map the actual CSV column names to our expected structure
        const stats: CommunityStats = {
            activeMembers: row.discord_members || defaultStats.activeMembers,
            activeVolunteers: row.discord_volunteers || defaultStats.activeVolunteers,
            successStories: row.success_stories || defaultStats.successStories,
            githubUrl: row.github_url || defaultStats.githubUrl,
            linkedinUrl: row.linkedin_url || defaultStats.linkedinUrl,
            twitterUrl: row.twitter_url || defaultStats.twitterUrl,
            instagramUrl: row.instagram_url || defaultStats.instagramUrl
        };

        return stats;

    } catch (error) {
        return defaultStats;
    }
}
