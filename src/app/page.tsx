export const revalidate = 300;

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Github, Instagram, Linkedin, Twitter, Users, Code, Briefcase, Award, MapPin, MessageSquareQuote, Handshake, TrendingUp, Sparkles, UserCheck, Trophy, Star } from 'lucide-react';
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
import { leaderboardData as fallbackLeaderboardData } from '@/data/leaderboard';

export default async function Home() {
  // Use optimized data fetcher with caching and parallel requests
  const {
    interviewQuestions,
    scenarioQuestions,
    liveQuestions,
    communityQuestions,
    jobs: allJobs,
    leaderboardData,
    communityStats
  } = await getHomePageData();
  
  // Combine all question sources from real-time spreadsheets
  const allQuestions = [
    ...interviewQuestions,
    ...scenarioQuestions,
    ...liveQuestions,
    ...communityQuestions
  ];
  
  // Take first 6 questions for homepage display (2 from each category if available)
  const questionSnippets = allQuestions.slice(0, 6);
  
  // Show all jobs instead of filtering by date since the dates in the sheet are future dates
  const recentJobs = allJobs;

  // Use fallback leaderboard data if Google Sheets data is empty
  const displayLeaderboardData = leaderboardData.length > 0 
    ? leaderboardData 
    : fallbackLeaderboardData;

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

        {/* Leaderboard Section - Enhanced Responsive Design */}
        <section className="text-center py-8 md:py-12 scroll-mt-24" id="leaderboard">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 font-headline">
            <Award className="inline-block mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
            ./Volunteer-Leaderboard
          </h2>
          <Card className="max-w-full md:max-w-4xl mx-auto bg-card/80 backdrop-blur-sm card-neo-border border-2 border-primary/30 shadow-2xl shadow-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/30">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="text-sm md:text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] md:w-[100px] text-center">Rank</TableHead>
                      <TableHead className="text-center">Contributor</TableHead>
                      <TableHead className="text-center">Contributions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayLeaderboardData.map((contributor) => (
                      <TableRow key={contributor.rank} className="border-border/50">
                        <TableCell className="font-medium text-accent text-center">{contributor.rank}</TableCell>
                        <TableCell className="font-medium">{contributor.name}</TableCell>
                        <TableCell className="text-center text-accent">{contributor.contributions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <SectionDivider />

        {/* Jobs Section - Enhanced Responsive Design */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12" id="jobs">
          <div className="order-2 md:order-1 min-h-[200px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
            <JobsTerminalAnimation jobs={recentJobs} />
          </div>
          <div className="space-y-3 md:space-y-4 order-1 md:order-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline">
              <Briefcase className="inline-block mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-primary"/> ./Job-Portal
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

        <SectionDivider />

        {/* Community Stats Section - Enhanced Responsive Design */}
        <section className="text-center border-border rounded-lg p-6 md:p-8 lg:p-12 card-neo-border py-8 md:py-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-headline">Join Our Growing Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 text-sm md:text-base">
            Connect with peers, learn from experts, and accelerate your career. Follow us on our social channels to stay updated.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 text-left">
              <Card className="bg-transparent border-0 shadow-none p-4 md:p-6">
                  <CardHeader className="flex items-center flex-row gap-3 md:gap-4 p-0">
                      <div className="bg-primary/20 p-2 md:p-3 rounded-md">
                          <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div>
                          <CardTitle className="text-xl md:text-2xl">{communityStats.activeMembers}</CardTitle>
                          <CardDescription className="text-sm md:text-base">Active Members</CardDescription>
                      </div>
                  </CardHeader>
              </Card>
               <Card className="bg-transparent border-0 shadow-none p-4 md:p-6">
                  <CardHeader className="flex items-center flex-row gap-3 md:gap-4 p-0">
                      <div className="bg-primary/20 p-2 md:p-3 rounded-md">
                          <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                       <div>
                          <CardTitle className="text-xl md:text-2xl">{communityStats.activeVolunteers}</CardTitle>
                          <CardDescription className="text-sm md:text-base">Active Volunteers</CardDescription>
                      </div>
                  </CardHeader>
              </Card>
               <Card className="bg-transparent border-0 shadow-none p-4 md:p-6 sm:col-span-2 lg:col-span-1">
                  <CardHeader className="flex items-center flex-row gap-3 md:gap-4 p-0">
                      <div className="bg-primary/20 p-2 md:p-3 rounded-md">
                          <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                       <div>
                          <CardTitle className="text-xl md:text-2xl">{communityStats.successStories}</CardTitle>
                          <CardDescription className="text-sm md:text-base">Success Stories</CardDescription>
                      </div>
                  </CardHeader>
              </Card>
          </div>
          <div className="flex justify-center gap-4 md:gap-6">
            <a href={communityStats.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={24} className="md:w-7 md:h-7" />
            </a>
            <a href={communityStats.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={24} className="md:w-7 md:h-7" />
            </a>
            <a href={communityStats.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={24} className="md:w-7 md:h-7" />
            </a>
            <a href={communityStats.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={24} className="md:w-7 md:h-7" />
            </a>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}
