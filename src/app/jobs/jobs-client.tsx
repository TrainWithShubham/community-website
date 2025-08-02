'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Job } from '@/data/jobs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experienceLevels = ['All', 'Internship', 'Fresher', '0-2 years', '0-5 years', '3-5 years', '5-10 years'];

interface JobsClientProps {
  recentJobs: Job[];
}

export function JobsClient({ recentJobs }: JobsClientProps) {
  const [selectedExperience, setSelectedExperience] = useState('All');

  const filteredJobs = useMemo(() => {
    if (selectedExperience === 'All') {
      return recentJobs;
    }
    return recentJobs.filter(job => job.experience === selectedExperience);
  }, [recentJobs, selectedExperience]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>Filter by Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedExperience} onValueChange={setSelectedExperience} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {experienceLevels.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={level.replace(/\s+/g, '-')} />
                  <Label htmlFor={level.replace(/\s+/g, '-')}>{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </aside>

      <main className="lg:col-span-3">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <Card key={job.id} className="flex flex-col border-secondary hover:border-primary transition-colors rounded-none">
                <CardHeader>
                  <CardTitle className="text-primary">{job.title}</CardTitle>
                  <CardDescription>@ {job.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-accent" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2 text-accent" />
                    {job.experience}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-accent" />
                    Posted on {formatDate(job.postedDate)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'} className="rounded-none">
                    {job.type}
                  </Badge>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none">
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply_Now</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-destructive rounded-none p-12 h-full">
            <h3 className="text-xl font-semibold text-destructive-foreground">`jobs matching query not found`</h3>
            <p className="text-muted-foreground mt-2">
              There are no job listings matching your criteria. Try another filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
