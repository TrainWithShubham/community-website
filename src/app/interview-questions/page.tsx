import { InterviewQuestionsClient } from './interview-questions-client';
import { getInterviewQuestions, getScenarioQuestions, getLiveQuestions, getCommunityQuestions } from '@/services/google-sheets';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Questions',
  description: 'Prepare for your next interview with our curated list of DevOps, Cloud, and DevSecOps questions, including real-world scenarios and live interview simulations.',
  keywords: ['DevOps Interview', 'Cloud Interview', 'DevSecOps Interview', 'Tech Interview Questions', 'Interview Preparation', 'Career Development'],
  openGraph: {
    title: 'Interview Questions | TWS Community Hub',
    description: 'Prepare for your next interview with our curated list of DevOps, Cloud, and DevSecOps questions, including real-world scenarios and live interview simulations.',
    images: ['/og-interview.svg'],
  },
  twitter: {
    title: 'Interview Questions | TWS Community Hub',
    description: 'Prepare for your next interview with our curated list of DevOps, Cloud, and DevSecOps questions, including real-world scenarios and live interview simulations.',
    images: ['/og-interview.svg'],
  },
};

export default async function InterviewQuestionsPage() {
  const [interviewQuestions, scenarioQuestions, liveQuestions, communityQuestions] = await Promise.allSettled([
    getInterviewQuestions(),
    getScenarioQuestions(),
    getLiveQuestions(),
    getCommunityQuestions(),
  ]);

  const questionsMap = {
    interview: interviewQuestions.status === 'fulfilled' ? interviewQuestions.value : [],
    scenario: scenarioQuestions.status === 'fulfilled' ? scenarioQuestions.value : [],
    live: liveQuestions.status === 'fulfilled' ? liveQuestions.value : [],
    community: communityQuestions.status === 'fulfilled' ? communityQuestions.value : [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Interview Questions</h1>
      
      <InterviewQuestionsClient questionsMap={questionsMap} />
    </div>
  );
}
