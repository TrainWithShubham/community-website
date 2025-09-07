import { Terminal } from 'lucide-react';
import { JobsClient } from './jobs-client';
import { getJobs } from '@/services/google-sheets';
import { SectionDivider } from '@/components/section-divider';

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
