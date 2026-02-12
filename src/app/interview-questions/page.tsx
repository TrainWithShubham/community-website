import { InterviewQuestionsNewClient } from './interview-questions-client';
import { getAllInterviewQuestions, getFilterOptions } from '@/services/github-csv';
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
  const questions = await getAllInterviewQuestions();
  const filterOptions = getFilterOptions(questions);
  return (
    <div className="container mx-auto px-4 py-8">
      <InterviewQuestionsNewClient questions={questions} filterOptions={filterOptions} />
    </div>
  );
}
