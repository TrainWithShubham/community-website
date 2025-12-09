import { trackError, trackPerformance } from './monitoring';
import { 
  getInterviewQuestions, 
  getScenarioQuestions, 
  getLiveQuestions, 
  getCommunityQuestions,
  getJobs,
} from '@/services/google-sheets';
import type { Question } from '@/data/questions';
import type { Job } from '@/data/jobs';

export interface HomePageData {
  interviewQuestions: Question[];
  scenarioQuestions: Question[];
  liveQuestions: Question[];
  communityQuestions: Question[];
  jobs: Job[];
}

// Function to transform community questions from Google Sheets API format to Question type
function transformCommunityQuestions(apiQuestions: any[]): Question[] {
  return apiQuestions.map(q => ({
    question: q.question || '',
    answer: q.answer || '',
    author: q.author || 'Anonymous'
  }));
}

function getFallbackData(): HomePageData {
  return {
    interviewQuestions: [],
    scenarioQuestions: [],
    liveQuestions: [],
    communityQuestions: [],
    jobs: [],
  };
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
    console.log('[Build] Fetching homepage data from Google Sheets...');
    
    const [
      interviewQuestions,
      scenarioQuestions,
      liveQuestions,
      communityQuestions,
      jobs,
    ] = await Promise.allSettled([
      retryFetch(() => getInterviewQuestions()),
      retryFetch(() => getScenarioQuestions()),
      retryFetch(() => getLiveQuestions()),
      retryFetch(() => getCommunityQuestions()),
      retryFetch(() => getJobs()),
    ]);

    const duration = Date.now() - startTime;
    trackPerformance('homepage-data-fetch', duration);
    console.log(`[Build] Homepage data fetched in ${duration}ms`);

    // Check for critical failures
    const failures = [
      { name: 'Interview Questions', result: interviewQuestions },
      { name: 'Scenario Questions', result: scenarioQuestions },
      { name: 'Live Questions', result: liveQuestions },
      { name: 'Community Questions', result: communityQuestions },
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

    // Transform community questions to match Question type
    const transformedCommunityQuestions = communityQuestions.status === 'fulfilled' 
      ? transformCommunityQuestions(communityQuestions.value)
      : [];

    return {
      interviewQuestions: interviewQuestions.status === 'fulfilled' ? interviewQuestions.value : [],
      scenarioQuestions: scenarioQuestions.status === 'fulfilled' ? scenarioQuestions.value : [],
      liveQuestions: liveQuestions.status === 'fulfilled' ? liveQuestions.value : [],
      communityQuestions: transformedCommunityQuestions,
      jobs: jobs.status === 'fulfilled' ? jobs.value : [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Build] Failed to fetch homepage data:', errorMessage);
    trackError(error as Error, 'homepage-data-fetch');
    
    // Fail the build if data fetching fails completely
    throw new Error(`Build failed: Unable to fetch data from Google Sheets. ${errorMessage}`);
  }
}
