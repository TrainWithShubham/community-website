import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Code, Briefcase, MapPin, MessageSquareQuote, Handshake, TrendingUp, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TerminalAnimation } from '@/components/terminal-animation';
import { ClientOnly } from '@/components/client-only';
import { type Job, jobs } from '@/data/jobs';
import { Badge } from '@/components/ui/badge';
import { JobsTerminalAnimation } from '@/components/jobs-terminal-animation';
import { QuestionsTerminalAnimation } from '@/components/questions-terminal-animation';
import { getHomePageData } from '@/lib/data-fetcher';
import { SectionDivider } from '@/components/section-divider';
import { ErrorBoundary } from '@/components/error-boundary';

export default async function Home() {
  // Fetch data at build time
  // Interview questions from GitHub CSV, Jobs from Google Sheets
  const {
    interviewQuestions,
    jobs: allJobs,
  } = await getHomePageData();
  
  // Transform InterviewQuestion to Question format for the terminal animation
  // The terminal animation expects { question, answer?, author? }
  const questionSnippets = interviewQuestions.slice(0, 6).map(q => ({
    question: q.question,
    answer: `Asked at ${q.company} for ${q.role} position (${q.experience})`,
    author: q.contributor,
  }));
  
  // Show all jobs
  const recentJobs = allJobs;

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section - Enhanced Responsive Design */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">
              <span className="text-primary">$</span> Welcome to the <span className="tws-gradient">TrainWithShubham</span> Community
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              <span className="text-primary">&gt;</span> Your hub for DevOps, Cloud, and DevSecOps. We foster project-based learning through workshops, community calls, and expert sessions. Explore job opportunities, tackle real-world interview questions, and grow with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base min-h-[44px] md:min-h-[40px] px-4 md:px-6">
                <a href="https://discord.gg/kGEr9mR5gT" target="_blank" rel="noopener noreferrer">
                  <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" /> join_discord
                </a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3 min-h-[200px] md:min-h-[240px] lg:min-h-[280px]">
             <ClientOnly>
              <TerminalAnimation />
            </ClientOnly>
          </div>
        </section>

        <SectionDivider />

        {/* Jobs Section - Enhanced Responsive Design */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12" id="jobs">
          <div className="order-2 md:order-1 min-h-[200px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
            <JobsTerminalAnimation jobs={recentJobs} />
          </div>
          <div className="space-y-3 md:space-y-4 order-1 md:order-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline">
              <Briefcase className="inline-block mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-primary"/> ./JobBoard
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              <span className="text-primary">&gt;</span> Find your next role in DevOps, Cloud, or DevSecOps. We feature opportunities for interns, freshers, and experienced professionals.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base min-h-[44px] md:min-h-[40px] px-4 md:px-6">
              <Link href="/jobs">ls -l /jobs</Link>
            </Button>
          </div>
        </section>

        <SectionDivider />

         {/* Interview Questions Section - Enhanced Responsive Design */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12" id="interview">
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline">
              <Code className="inline-block mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-primary"/> ./Interview-Questions
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              <span className="text-primary">&gt;</span> Prepare for your next interview with our curated list of questions, including real-world scenarios and live interview simulations.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base min-h-[44px] md:min-h-[40px] px-4 md:px-6">
              <Link href="/interview-questions">cat /interview-questions</Link>
            </Button>
          </div>
           <div className="order-first md:order-last min-h-[200px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
              <ClientOnly>
                <QuestionsTerminalAnimation questions={questionSnippets} />
              </ClientOnly>
          </div>
        </section>

      </div>
    </ErrorBoundary>
  );
}
