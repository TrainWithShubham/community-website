
'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import { AlertCircle, Loader2, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionCard } from '@/components/question-card';
import { AddQuestionForm } from '@/components/add-question-form';
import type { Question } from '@/data/questions';
import { handleSearch } from './actions';
import { useAuth } from '@/contexts/auth-context';

type QuestionCategory = 'interview' | 'scenario' | 'live' | 'community';

interface InterviewQuestionsClientProps {
  questionsMap: Record<QuestionCategory, Question[]>;
}

export function InterviewQuestionsClient({ questionsMap }: InterviewQuestionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Question[] | null>(null);
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<QuestionCategory>('interview');
  const [isPending, startTransition] = useTransition();

  const currentQuestions = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    return questionsMap[activeTab];
  }, [activeTab, searchQuery, searchResults, questionsMap]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(null);
    }
  }, [searchQuery]);

  const onSearch = () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }
    startTransition(async () => {
      const results = await handleSearch(
        searchQuery, 
        activeTab, 
        questionsMap[activeTab],
        user?.uid
      );
      setSearchResults(results);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const renderQuestionList = (questions: Question[]) => {
    if (isPending) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (searchQuery && searchResults?.length === 0) {
      return (
        <div className="mt-8">
          <Alert variant="destructive" className="border-destructive text-destructive-foreground rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Results Found</AlertTitle>
            <AlertDescription>
              Your search for "{searchQuery}" did not return any results. Please try a different term.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (!questions || questions.length === 0) {
      return (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-lg">
            [~] No questions available in this category yet.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-4">
        {questions.map((q, index) => (
          <QuestionCard key={index} question={q.question} answer={q.answer} author={q.author} />
        ))}
      </div>
    );
  };

  const renderCommunitySection = () => {
    if (loading) {
      return (
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading authentication...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="mt-6 mb-8">
          <Alert className="border-primary/40 bg-primary/10 text-foreground rounded-lg shadow-sm">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Authentication Required</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Please log in to contribute questions to the community.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="mt-6 mb-8">
        <AddQuestionForm>
          <Button 
            variant="outline" 
            className="border-primary/40 text-primary hover:border-primary/60 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-300 font-mono text-sm shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 
            contribute.sh
          </Button>
        </AddQuestionForm>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value as QuestionCategory);
          setSearchQuery('');
          setSearchResults(null);
        }} 
        className="w-full"
      >
        {/* Header Section with Tabs and Search */}
        <div className="bg-card/90 backdrop-blur-sm border border-border shadow-xl rounded-lg p-6 mb-8 card-neo-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Tabs Section */}
            <div className="flex-shrink-0">
              <TabsList className="bg-muted/80 p-1 rounded-lg border border-border">
                <TabsTrigger 
                  value="interview" 
                  className="text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2 font-mono text-sm transition-all duration-300"
                >
                  interview.sh
                </TabsTrigger>
                <TabsTrigger 
                  value="scenario" 
                  className="text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2 font-mono text-sm transition-all duration-300"
                >
                  scenario.sh
                </TabsTrigger>
                <TabsTrigger 
                  value="live" 
                  className="text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2 font-mono text-sm transition-all duration-300"
                >
                  live.sh
                </TabsTrigger>
                <TabsTrigger 
                  value="community" 
                  className="text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2 font-mono text-sm transition-all duration-300"
                >
                  community.sh
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search Section */}
            <div className="flex-grow lg:max-w-md">
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono text-sm hidden sm:inline-block">
                  ~/tws/questions/{activeTab} $
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="grep -i 'search term'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <Button 
                    onClick={onSearch} 
                    disabled={isPending} 
                    aria-label="Search" 
                    variant="outline" 
                    className="border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all duration-300"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <TabsContent value="interview" className="mt-0">
          {renderQuestionList(currentQuestions)}
        </TabsContent>
        
        <TabsContent value="scenario" className="mt-0">
          {renderQuestionList(currentQuestions)}
        </TabsContent>
        
        <TabsContent value="live" className="mt-0">
          {renderQuestionList(currentQuestions)}
        </TabsContent>
        
        <TabsContent value="community" className="mt-0">
          {renderCommunitySection()}
          {renderQuestionList(currentQuestions)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
