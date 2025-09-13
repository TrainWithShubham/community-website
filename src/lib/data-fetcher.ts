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
      getCachedData('community-questions', getCommunityQuestionsFromSheetsAPI, 60),
      getCachedData('jobs', getJobs, 300), // 5 min
      getCachedData('leaderboard', getLeaderboardData, 300), // 5 minutes to align with ISR
      getCachedData('community-stats', getCommunityStats, 300) // 5 minutes
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
