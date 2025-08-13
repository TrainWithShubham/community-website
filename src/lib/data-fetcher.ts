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
import type { Question } from '@/data/questions';
import type { Job } from '@/data/jobs';
import type { Contributor } from '@/data/leaderboard';

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

function getDefaultStats() {
  return {
    activeMembers: "10k+",
    activeVolunteers: "50+",
    successStories: "200+",
    githubUrl: "https://github.com/trainwithshubham",
    linkedinUrl: "https://linkedin.com/company/trainwithshubham",
    twitterUrl: "https://twitter.com/trainwithshubham",
    instagramUrl: "https://instagram.com/trainwithshubham"
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
      getCachedData('interview-questions', getInterviewQuestions, 600), // 10 min
      getCachedData('scenario-questions', getScenarioQuestions, 600),
      getCachedData('live-questions', getLiveQuestions, 600),
      getCachedData('community-questions', getCommunityQuestions, 300), // 5 min
      getCachedData('jobs', getJobs, 1800), // 30 min
      getCachedData('leaderboard', getLeaderboardData, 3600), // 1 hour
      getCachedData('community-stats', getCommunityStats, 7200), // 2 hours
    ]);

    const duration = Date.now() - startTime;
    trackPerformance('homepage-data-fetch', duration);

    return {
      interviewQuestions: interviewQuestions.status === 'fulfilled' ? interviewQuestions.value : [],
      scenarioQuestions: scenarioQuestions.status === 'fulfilled' ? scenarioQuestions.value : [],
      liveQuestions: liveQuestions.status === 'fulfilled' ? liveQuestions.value : [],
      communityQuestions: communityQuestions.status === 'fulfilled' ? communityQuestions.value : [],
      jobs: jobs.status === 'fulfilled' ? jobs.value : [],
      leaderboardData: leaderboardData.status === 'fulfilled' ? leaderboardData.value : [],
      communityStats: communityStats.status === 'fulfilled' ? communityStats.value : getDefaultStats(),
    };
  } catch (error) {
    trackError(error as Error, 'homepage-data-fetch');
    console.error('Error fetching home page data:', error);
    return getFallbackData();
  }
}
