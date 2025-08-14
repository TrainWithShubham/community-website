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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            Interview Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore comprehensive DevOps interview questions, scenario-based challenges, and live incident cases.
          </p>
        </div>
        
        {/* Main Content */}
        <InterviewQuestionsClient questionsMap={questionsMap} />
      </div>
    </div>
  );
}
