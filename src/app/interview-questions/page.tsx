import { TerminalAnimation } from '@/components/terminal-animation';
import { ClientOnly } from '@/components/client-only';
import { InterviewQuestionsClient } from './interview-questions-client';
import { getScenarioQuestions, getInterviewQuestions, getLiveQuestions, getCommunityQuestions } from '@/services/google-sheets';
import { SectionDivider } from '@/components/section-divider';

export default async function InterviewQuestionsPage() {
  const [scenarioQuestions, interviewQuestions, liveQuestions, communityQuestions] = await Promise.all([
    getScenarioQuestions(),
    getInterviewQuestions(),
    getLiveQuestions(),
    getCommunityQuestions(),
  ]);
  
  const questionsMap = {
    interview: interviewQuestions,
    scenario: scenarioQuestions,
    live: liveQuestions,
    community: communityQuestions,
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-12 min-h-[220px] flex items-center justify-center">
        <div className="w-full max-w-full">
          <ClientOnly>
            <TerminalAnimation />
          </ClientOnly>
        </div>
      </section>

      <SectionDivider />

      <InterviewQuestionsClient questionsMap={questionsMap} />
    </div>
  );
}
