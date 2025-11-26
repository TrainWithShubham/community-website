'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Job } from '@/data/jobs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const experienceLevels = ['All', 'Internship', 'Fresher', '0-2 years', '0-5 years', '3-5 years', '5-10 years'];

interface JobsClientProps {
  recentJobs: Job[];
}

const ITEMS_PER_PAGE = 6; // Number of jobs per page

export function JobsClient({ recentJobs }: JobsClientProps) {
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = useMemo(() => {
    if (selectedExperience === 'All') {
      return recentJobs;
    }
    return recentJobs.filter(job => job.experience === selectedExperience);
  }, [recentJobs, selectedExperience]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedExperience]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of jobs section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1" aria-label="Job filters">
  <Card className='rounded-lg'>
          <CardHeader>
            <CardTitle>Filter by Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedExperience} 
              onValueChange={setSelectedExperience} 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4"
              aria-label="Experience level filter"
            >
              {experienceLevels.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={level} 
                    id={level.replace(/\s+/g, '-')}
                    aria-describedby={`${level.replace(/\s+/g, '-')}-description`}
                  />
                  <Label 
                    htmlFor={level.replace(/\s+/g, '-')}
                    id={`${level.replace(/\s+/g, '-')}-description`}
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </aside>

      <main className="lg:col-span-3">
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
            {selectedExperience !== 'All' && ` (filtered by ${selectedExperience})`}
          </p>
        </div>

        {currentJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Job listings">
              {currentJobs.map(job => (
              <Card 
                key={job.id} 
                className="flex flex-col border-secondary hover:border-primary transition-colors rounded-lg"
                role="listitem"
                aria-labelledby={`job-title-${job.id}`}
              >
                <CardHeader>
                  <CardTitle 
                    id={`job-title-${job.id}`}
                    className="text-primary"
                  >
                    {job.title}
                  </CardTitle>
                  <CardDescription>@ {job.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-accent" aria-hidden="true" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2 text-accent" aria-hidden="true" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-accent" aria-hidden="true" />
                    <span>Posted on {formatDate(job.postedDate)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Badge 
                    variant={job.type === 'Full-time' ? 'default' : 'secondary'} 
                    className="rounded-md"
                    aria-label={`Job type: ${job.type}`}
                  >
                    {job.type}
                  </Badge>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    aria-label={`Apply for ${job.title} at ${job.company}`}
                  >
                    <a 
                      href={job.applyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Apply_Now
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {generatePageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page as number);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-destructive rounded-lg p-12 h-full">
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
