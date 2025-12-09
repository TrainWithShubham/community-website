
'use client';

import { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionCard } from '@/components/question-card';
import type { Question } from '@/data/questions';
import { createQuestionSearch } from '@/lib/client-search';

type QuestionCategory = 'interview' | 'scenario' | 'live' | 'community';

interface InterviewQuestionsClientProps {
  questionsMap: Record<QuestionCategory, Question[]>;
}

export function InterviewQuestionsClient({ questionsMap }: InterviewQuestionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<QuestionCategory>('interview');

  // Create search instance for current tab's questions
  const searchInstance = useMemo(() => {
    return createQuestionSearch(questionsMap[activeTab]);
  }, [activeTab, questionsMap]);

  // Perform client-side search
  const currentQuestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return questionsMap[activeTab];
    }
    return searchInstance.search(searchQuery);
  }, [searchQuery, activeTab, questionsMap, searchInstance]);

  const renderQuestionList = (questions: Question[]) => {
    if (searchQuery && questions.length === 0) {
      return (
        <Alert variant="destructive" className="mt-4 border-destructive text-destructive-foreground rounded-lg">
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
      <div className="space-y-2 mt-6">
        {questions.map((q, index) => (
          <QuestionCard key={index} question={q.question} answer={q.answer} author={q.author} />
        ))}
      </div>
    );
  };

  const renderCommunitySection = () => {
    return (
      <div className="text-left my-4">
        <Alert className="border-primary/20 bg-primary/5 text-foreground rounded-lg">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground font-semibold">Want to Contribute?</AlertTitle>
          <AlertDescription className="text-foreground/80">
            <a 
              href="https://forms.google.com/your-form-url" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Submit your question via Google Form
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => {
      setActiveTab(value as QuestionCategory);
      setSearchQuery('');
    }} className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
        <TabsList className="bg-transparent p-0 rounded-md border-0">
          <TabsTrigger value="interview">interview.sh</TabsTrigger>
          <TabsTrigger value="scenario">scenario.sh</TabsTrigger>
          <TabsTrigger value="live">live.sh</TabsTrigger>
          <TabsTrigger value="community">community.sh</TabsTrigger>
        </TabsList>
        <div className="flex-grow md:max-w-sm flex items-center gap-2">
          <span className="text-primary hidden sm:inline-block">~/tws/questions/{activeTab} $</span>
          <Input
            type="search"
            placeholder={`grep -i "..."`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-primary/50"
          />
          <Button aria-label="Search" variant="outline" className="border-primary/50">
            <Search className="h-4 w-4" />
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
