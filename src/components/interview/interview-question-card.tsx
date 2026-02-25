'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, Calendar, User, Briefcase, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { InterviewQuestion } from '@/services/github-csv';

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  index: number;
}

export function InterviewQuestionCard({ question, index }: InterviewQuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Building2 className="h-3 w-3" />
                {question.company}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {question.year}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {question.topic}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold leading-tight">
              <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
              {question.question}
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0 space-y-3", !isExpanded && "pb-3")}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{question.role}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{question.experience}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span className="text-primary">{question.contributor}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground italic">
              This question was asked at <strong>{question.company}</strong> for the{' '}
              <strong>{question.role}</strong> position, targeting candidates with{' '}
              <strong>{question.experience}</strong> of experience.
            </p>
            <p className="text-sm text-muted-foreground italic mt-2">
              Contributed by <strong className="text-primary">{question.contributor}</strong> in {question.year}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
