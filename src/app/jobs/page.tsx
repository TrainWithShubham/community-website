import { Terminal } from 'lucide-react';
import { JobsClient } from './jobs-client';
import { getJobs } from '@/services/google-sheets';
import { SectionDivider } from '@/components/section-divider';

export default async function JobsPage() {
  const allJobs = await getJobs();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentJobs = allJobs.filter(job => new Date(job.postedDate) > sevenDaysAgo);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center gap-4">
          <Terminal className="h-10 w-10 text-primary" />
          ./JobBoard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your next career move in the DevOps ecosystem starts here.</p>
        <p className="text-sm text-accent mt-1">// Displaying jobs posted in the last 7 days.</p>
      </div>
      
      <SectionDivider />

      <JobsClient recentJobs={recentJobs} />
    </div>
  );
}
