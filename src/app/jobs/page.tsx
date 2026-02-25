import { Terminal, MessageCircle } from 'lucide-react';
import { JobsClient } from './jobs-client';
import { getJobs } from '@/services/google-sheets';
import { SectionDivider } from '@/components/section-divider';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

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
        <p className="text-sm text-accent mt-1">{'// Displaying all available job opportunities.'}</p>
      </div>

      {/* Top notice */}
      <div className="mb-8 rounded-lg border border-border bg-card px-4 py-3 text-center font-mono text-sm text-muted-foreground">
        <span className="text-accent">{'// '}</span>Jobs updated periodically. For daily openings, join our{' '}
        <a
          href="https://discord.gg/kGEr9mR5gT"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Discord
        </a>
      </div>

      <SectionDivider />

      <JobsClient recentJobs={recentJobs} />

      {/* Bottom Discord CTA */}
      <SectionDivider />
      <div className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/5 p-8 text-center">
        <div className="mb-3 flex justify-center">
          <MessageCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold font-headline mb-2">
          Want daily job openings?
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          <span className="text-primary">&gt;</span> We share fresh DevOps, Cloud, and DevSecOps job openings every day in our Discord server.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
          <a href="https://discord.gg/kGEr9mR5gT" target="_blank" rel="noopener noreferrer">
            join_discord --daily-jobs
          </a>
        </Button>
      </div>
    </div>
  );
}
