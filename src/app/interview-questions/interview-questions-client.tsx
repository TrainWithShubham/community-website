
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
      return <div className="flex justify-center items-center p-8 card-neo-border"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (searchQuery && searchResults?.length === 0) {
      return (
        <Alert variant="destructive" className="mt-4 border-destructive text-destructive-foreground rounded-none card-neo-border">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Results Found</AlertTitle>
          <AlertDescription>
            Your search for "{searchQuery}" did not return any results. Please try a different term.
          </AlertDescription>
        </Alert>
      );
    }

    if (!questions || questions.length === 0) {
      return <p className="text-muted-foreground mt-4 text-center md:text-left">[~] No questions available in this category yet.</p>;
    }

    return (
      <div className="space-y-2 mt-6 p-4 card-neo-border">
        {questions.map((q, index) => (
          <QuestionCard key={index} question={q.question} answer={q.answer} author={q.author} />
        ))}
      </div>
    );
  };

  const renderCommunitySection = () => {
    if (loading) {
      return (
        <div className="text-left my-4">
          <div className="flex items-center gap-2 p-4 card-neo-border">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading authentication...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-left my-4">
          <Alert className="border-accent text-accent-foreground rounded-none card-neo-border">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to contribute questions to the community.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="text-left my-4">
        <div className="p-4 card-neo-border">
          <AddQuestionForm>
            <Button variant="outline" className="border-accent text-accent rounded-none">
              <PlusCircle className="mr-2 h-4 w-4" /> contribute.sh
            </Button>
          </AddQuestionForm>
        </div>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => {
      setActiveTab(value as QuestionCategory);
      setSearchQuery('');
      setSearchResults(null);
    }} className="w-full p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
        <TabsList className="bg-transparent p-0 rounded-none border-0">
          <TabsTrigger value="interview">interview.sh</TabsTrigger>
          <TabsTrigger value="scenario">scenario.sh</TabsTrigger>
          <TabsTrigger value="live">live.sh</TabsTrigger>
          <TabsTrigger value="community">community.sh</TabsTrigger>
        </TabsList>
        <div className="flex-grow md:max-w-sm flex items-center gap-2 p-3 card-neo-border">
          <span className="text-primary hidden sm:inline-block">~/tws/questions/{activeTab} $</span>
          <Input
            type="search"
            placeholder={`grep -i "..."`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-card border-primary/50"
          />
          <Button onClick={onSearch} disabled={isPending} aria-label="Search" variant="outline" className="border-primary/50 rounded-none">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <TabsContent value="interview" className="mt-6">{renderQuestionList(currentQuestions)}</TabsContent>
      <TabsContent value="scenario" className="mt-6">{renderQuestionList(currentQuestions)}</TabsContent>
      <TabsContent value="live" className="mt-6">{renderQuestionList(currentQuestions)}</TabsContent>
      <TabsContent value="community" className="mt-6">
        {renderCommunitySection()}
        {renderQuestionList(currentQuestions)}
      </TabsContent>
    </Tabs>
  );
}
