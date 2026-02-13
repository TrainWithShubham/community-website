"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, AlertCircle, Download, RefreshCw, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InterviewQuestionCard } from '@/components/interview/interview-question-card';
import { QuestionFilters, type FilterState } from '@/components/interview/question-filters';
import type { InterviewQuestion } from '@/services/github-csv';
import { getAllInterviewQuestions, getFilterOptions } from '@/services/github-csv';
import Fuse from 'fuse.js';

interface InterviewQuestionsNewClientProps {
  questions: InterviewQuestion[];
  filterOptions: {
    companies: string[];
    years: string[];
    roles: string[];
    experiences: string[];
    topics: string[];
    contributors: string[];
  };
}

export function InterviewQuestionsNewClient({ 
  questions: initialQuestions, 
  filterOptions: initialFilterOptions 
}: InterviewQuestionsNewClientProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(initialQuestions);
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [isLoading, setIsLoading] = useState(initialQuestions.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    company: '',
    year: '',
    role: '',
    experience: '',
    topic: '',
    contributor: '',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch questions on mount if not provided
  useEffect(() => {
    if (questions.length === 0) {
      loadQuestions();
    }
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await getAllInterviewQuestions();
      setQuestions(fetchedQuestions);
      setFilterOptions(getFilterOptions(fetchedQuestions));
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh handler with minimum delay for better UX
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    // Minimum 1 second delay so spinner is visible
    const [result] = await Promise.all([
      loadQuestions(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);
    setIsRefreshing(false);
  };

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(questions, {
      keys: ['question', 'topic', 'company', 'role'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [questions]);

  // Apply filters and search
  const filteredQuestions = useMemo(() => {
    let result = questions;

    // Apply filters first
    if (filters.company) {
      result = result.filter(q => q.company === filters.company);
    }
    if (filters.year) {
      result = result.filter(q => q.year === filters.year);
    }
    if (filters.role) {
      result = result.filter(q => q.role === filters.role);
    }
    if (filters.experience) {
      result = result.filter(q => q.experience === filters.experience);
    }
    if (filters.topic) {
      result = result.filter(q => q.topic === filters.topic);
    }
    if (filters.contributor) {
      result = result.filter(q => q.contributor === filters.contributor);
    }

    // Apply search using memoized Fuse instance (performance optimization)
    if (searchQuery.trim()) {
      // Create a new Fuse instance with filtered results
      const filteredFuse = new Fuse(result, {
        keys: ['question', 'topic', 'company', 'role'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      result = filteredFuse.search(searchQuery).map(r => r.item);
    }

    return result;
  }, [questions, filters, searchQuery]);

  const handleExport = () => {
    const csv = [
      ['Company', 'Year', 'Role', 'Experience', 'Topic', 'Question', 'Contributor'].join(','),
      ...filteredQuestions.map(q =>
        [q.company, q.year, q.role, q.experience, q.topic, `"${q.question.replace(/"/g, '""')}"`, q.contributor].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-questions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading questions...</span>
        </div>
      )}

      {/* Header Section */}
      {!isLoading && (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">DevOps Interview Questions</h1>
            <p className="text-muted-foreground mt-1">
              Real questions from top tech companies, contributed by the community
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleManualRefresh} 
              variant="outline" 
              className="gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 transition-transform ${isRefreshing ? 'animate-spin-slow' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{filterOptions.companies.length}</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{filterOptions.topics.length}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{filterOptions.contributors.length}</div>
            <div className="text-sm text-muted-foreground">Contributors</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions by keyword, topic, company, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      )}

      {/* Filters */}
      {!isLoading && (
      <>
      <QuestionFilters
        filters={filters}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredQuestions.length}</strong> of <strong>{questions.length}</strong> questions
          </p>
        </div>

        {filteredQuestions.length === 0 ? (
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">No Results Found</AlertTitle>
            <AlertDescription className="text-destructive/90">
              {searchQuery
                ? `No questions match your search for "${searchQuery}". Try different keywords or clear filters.`
                : 'No questions match your selected filters. Try adjusting or clearing some filters.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <InterviewQuestionCard
                key={`${question.company}-${question.year}-${index}`}
                question={question}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contribution CTA */}
      <Alert className="border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-foreground font-semibold">Want to Contribute?</AlertTitle>
        <AlertDescription className="text-foreground/80">
          Help the community by sharing interview questions you've encountered.{' '}
          <a
            href="https://github.com/TrainWithShubham/interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Submit a Pull Request on GitHub
          </a>
          {' '}with your questions in CSV format.
        </AlertDescription>
      </Alert>
      </>
      )}
    </div>
  );
}
