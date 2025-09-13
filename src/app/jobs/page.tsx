export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Terminal } from 'lucide-react';
import { JobsClient } from './jobs-client';
import { getJobs } from '@/services/google-sheets';
import { SectionDivider } from '@/components/section-divider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Board',
  description: 'Find your next role in DevOps, Cloud, or DevSecOps. We feature opportunities for interns, freshers, and experienced professionals.',
  keywords: ['DevOps Jobs', 'Cloud Jobs', 'DevSecOps Jobs', 'Tech Careers', 'Remote Jobs', 'Job Board'],
  openGraph: {
    title: 'Job Board | TWS Community Hub',
    description: 'Find your next role in DevOps, Cloud, or DevSecOps. We feature opportunities for interns, freshers, and experienced professionals.',
    images: ['/og-jobs.svg'],
  },
  twitter: {
    title: 'Job Board | TWS Community Hub',
    description: 'Find your next role in DevOps, Cloud, or DevSecOps. We feature opportunities for interns, freshers, and experienced professionals.',
    images: ['/og-jobs.svg'],
  },
};

export default async function JobsPage() {
  const allJobs = await getJobs();
  
  // Show all jobs instead of filtering by date since the dates in the sheet are future dates
  const recentJobs = allJobs;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center gap-4">
          <Terminal className="h-10 w-10 text-primary" />
          ./JobBoard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your next career move in the DevOps ecosystem starts here.</p>
        <p className="text-sm text-accent mt-1">// Displaying all available job opportunities.</p>
      </div>
      
      <SectionDivider />

      <JobsClient recentJobs={recentJobs} />
    </div>
  );
}
