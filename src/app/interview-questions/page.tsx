import { InterviewQuestionsClient } from './interview-questions-client';
import { getInterviewQuestions, getScenarioQuestions, getLiveQuestions, getCommunityQuestions } from '@/services/google-sheets';
import { getCommunityQuestionsFromSheetsAPI } from '@/services/google-sheets-api';

export default async function InterviewQuestionsPage() {
  const [interviewQuestions, scenarioQuestions, liveQuestions, communityQuestions] = await Promise.allSettled([
    getInterviewQuestions(),
    getScenarioQuestions(),
    getLiveQuestions(),
    getCommunityQuestionsFromSheetsAPI(), // Use Google Sheets API instead of CSV
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
