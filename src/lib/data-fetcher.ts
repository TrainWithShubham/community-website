import { getCachedData } from './cache';
import { trackError, trackPerformance } from './monitoring';
import { 
  getInterviewQuestions, 
  getScenarioQuestions, 
  getLiveQuestions, 
  getCommunityQuestions,
  getJobs,
  getLeaderboardData,
  getCommunityStats 
} from '@/services/google-sheets';
import { getCommunityQuestionsFromSheetsAPI } from '@/services/google-sheets-api';
import type { Question } from '@/data/questions';
import type { Job } from '@/data/jobs';
import type { Contributor } from '@/data/leaderboard';
import { unstable_cache } from 'next/cache';

export interface HomePageData {
  interviewQuestions: Question[];
  scenarioQuestions: Question[];
  liveQuestions: Question[];
  communityQuestions: Question[];
  jobs: Job[];
  leaderboardData: Contributor[];
  communityStats: {
    activeMembers: string;
    activeVolunteers: string;
    successStories: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    instagramUrl: string;
  };
}

// Function to transform community questions from Google Sheets API format to Question type
function transformCommunityQuestions(apiQuestions: any[]): Question[] {
  return apiQuestions.map(q => ({
    question: q.question || '',
    answer: q.answer || '',
    author: q.author || 'Anonymous'
  }));
}

function getDefaultStats() {
  return {
    activeMembers: "5600+",
    activeVolunteers: "4",
    successStories: "2000+",
    githubUrl: "https://github.com/trainwithshubham",
    linkedinUrl: "https://www.linkedin.com/company/trainwithshubham/",
    twitterUrl: "https://x.com/TrainWitShubham",
    instagramUrl: "https://www.instagram.com/trainwithshubham__"
  };
}

function getFallbackData(): HomePageData {
  return {
    interviewQuestions: [],
    scenarioQuestions: [],
    liveQuestions: [],
    communityQuestions: [],
    jobs: [],
    leaderboardData: [],
    communityStats: getDefaultStats(),
  };
}

// Create cached versions with tags for better cache invalidation
const getCachedInterviewQuestions = unstable_cache(
  () => getInterviewQuestions(),
  ['interview-questions'],
  { tags: ['interview-questions'], revalidate: 300 }
);

const getCachedScenarioQuestions = unstable_cache(
  () => getScenarioQuestions(),
  ['scenario-questions'],
  { tags: ['scenario-questions'], revalidate: 300 }
);

const getCachedLiveQuestions = unstable_cache(
  () => getLiveQuestions(),
  ['live-questions'],
  { tags: ['live-questions'], revalidate: 300 }
);

const getCachedCommunityQuestions = unstable_cache(
  () => getCommunityQuestionsFromSheetsAPI(),
  ['community-questions'],
  { tags: ['community-questions'], revalidate: 60 }
);

const getCachedJobs = unstable_cache(
  () => getJobs(),
  ['jobs'],
  { tags: ['jobs'], revalidate: 300 }
);

const getCachedLeaderboard = unstable_cache(
  () => getLeaderboardData(),
  ['leaderboard'],
  { tags: ['leaderboard'], revalidate: 300 }
);

const getCachedCommunityStats = unstable_cache(
  () => getCommunityStats(),
  ['community-stats'],
  { tags: ['community-stats'], revalidate: 300 }
);

export async function getHomePageData(): Promise<HomePageData> {
  const startTime = Date.now();
  
  try {
    const [
      interviewQuestions,
      scenarioQuestions,
      liveQuestions,
      communityQuestions,
      jobs,
      leaderboardData,
      communityStats
    ] = await Promise.allSettled([
      getCachedInterviewQuestions(),
      getCachedScenarioQuestions(),
      getCachedLiveQuestions(),
      getCachedCommunityQuestions(),
      getCachedJobs(),
      getCachedLeaderboard(),
      getCachedCommunityStats()
    ]);

    const duration = Date.now() - startTime;
    trackPerformance('homepage-data-fetch', duration);

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
      leaderboardData: leaderboardData.status === 'fulfilled' ? leaderboardData.value : [],
      communityStats: communityStats.status === 'fulfilled' ? communityStats.value : getDefaultStats(),
    };
  } catch (error) {
    trackError(error as Error, 'homepage-data-fetch');
    return getFallbackData();
  }
}
