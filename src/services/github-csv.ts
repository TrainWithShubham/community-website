/**
 * Service to fetch interview questions from GitHub CSV files
 * This replaces Google Sheets with direct GitHub repository CSV files
 */

import Papa from 'papaparse';

export interface InterviewQuestion {
  company: string;
  year: string;
  contributor: string;
  role: string;
  experience: string;
  topic: string;
  question: string;
}

// GitHub repository for interview questions
// Default to TrainWithShubham for production
const GITHUB_OWNER = process.env.NEXT_PUBLIC_INTERVIEW_REPO_OWNER || 'TrainWithShubham';
const GITHUB_REPO = process.env.NEXT_PUBLIC_INTERVIEW_REPO_NAME || 'interview-questions';
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_INTERVIEW_REPO_BRANCH || 'main';

// GitHub raw URL for the interview-questions repository
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// Available CSV files
const CSV_FILES = {
  devops: `${GITHUB_RAW_BASE}/devops/interview-questions.csv`,
  // Add more categories as they become available
  // cloud: `${GITHUB_RAW_BASE}/cloud/cloud-interview-questions.csv`,
  // aws: `${GITHUB_RAW_BASE}/aws/aws-interview-questions.csv`,
  
};

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 60, // GitHub allows 60 requests per hour for unauthenticated requests
  windowMs: 60 * 60 * 1000, // 1 hour
  requests: [] as number[],
};

/**
 * Check if we're within rate limits
 */
function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Remove requests older than the time window
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    timestamp => now - timestamp < RATE_LIMIT.windowMs
  );
  
  // Check if we've exceeded the limit
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    const oldestRequest = RATE_LIMIT.requests[0];
    const resetTime = new Date(oldestRequest + RATE_LIMIT.windowMs);
    console.warn(`Rate limit exceeded. Resets at ${resetTime.toISOString()}`);
    return false;
  }
  
  // Add current request
  RATE_LIMIT.requests.push(now);
  return true;
}

/**
 * Fetch CSV content from GitHub raw URL with rate limiting
 */
async function fetchGitHubCSV(url: string): Promise<string> {
  // Check rate limit before making request
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TWS-Community-Hub/1.0',
        'Accept': 'text/csv',
      },
      // Cache for 1 hour, then revalidate in background
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Check for rate limit response from GitHub
      if (response.status === 429) {
        const resetHeader = response.headers.get('X-RateLimit-Reset');
        const resetTime = resetHeader ? new Date(parseInt(resetHeader) * 1000) : 'unknown';
        throw new Error(`GitHub rate limit exceeded. Resets at ${resetTime}`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Received empty CSV data');
    }

    console.log(`✅ Loaded CSV from GitHub: ${url}`);
    return text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout while fetching CSV from ${url}`);
      }
      throw new Error(`Failed to fetch CSV: ${error.message}`);
    }
    throw new Error('Unknown error while fetching CSV');
  }
}

/**
 * Parse CSV text into structured interview questions
 */
function parseCSV(csvText: string): InterviewQuestion[] {
  const parsed = Papa.parse<InterviewQuestion>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (parsed.errors.length > 0) {
    console.error('CSV parsing errors:', parsed.errors);
  }

  return parsed.data
    .filter(row => row.question && row.question.trim() !== '')
    .map(row => ({
      company: row.company?.trim() || 'Unknown',
      year: row.year?.trim() || 'N/A',
      contributor: row.contributor?.trim() || 'Anonymous',
      role: row.role?.trim() || 'N/A',
      experience: row.experience?.trim() || 'N/A',
      topic: row.topic?.trim() || 'General',
      question: row.question?.trim() || '',
    }));
}

/**
 * Get all DevOps interview questions from GitHub
 */
export async function getDevOpsQuestions(): Promise<InterviewQuestion[]> {
  try {
    const csvText = await fetchGitHubCSV(CSV_FILES.devops);
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching DevOps questions:', error);
    return [];
  }
}

/**
 * Get all interview questions (consolidated from all categories)
 */
export async function getAllInterviewQuestions(): Promise<InterviewQuestion[]> {
  try {
    // For now, only DevOps is available
    // In the future, fetch from multiple CSV files
    const devopsQuestions = await getDevOpsQuestions();
    
    // When more categories are added:
    // const [devopsQuestions, cloudQuestions, awsQuestions] = await Promise.allSettled([
    //   getDevOpsQuestions(),
    //   getCloudQuestions(),
    //   getAWSQuestions(),
    // ]);
    
    return devopsQuestions;
  } catch (error) {
    console.error('Error fetching all interview questions:', error);
    return [];
  }
}

/**
 * Get unique filter values from questions
 */
export function getFilterOptions(questions: InterviewQuestion[]) {
  return {
    companies: [...new Set(questions.map(q => q.company))].sort(),
    years: [...new Set(questions.map(q => q.year))].sort().reverse(),
    roles: [...new Set(questions.map(q => q.role))].sort(),
    experiences: [...new Set(questions.map(q => q.experience))].sort(),
    topics: [...new Set(questions.map(q => q.topic))].sort(),
    contributors: [...new Set(questions.map(q => q.contributor))].sort(),
  };
}
