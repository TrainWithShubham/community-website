"use client"
import { useState, useEffect } from 'react';
import { type Question } from '@/data/questions';

interface QuestionsTerminalAnimationProps {
    questions: Question[];
}

export function QuestionsTerminalAnimation({ questions }: QuestionsTerminalAnimationProps) {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [isCommandComplete, setIsCommandComplete] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const command = `cat /var/log/interview_questions.log | head -n 3`;

  useEffect(() => {
    setDisplayedCommand('');
    setIsCommandComplete(false);
    
    const typeCommand = (index = 0) => {
        if(index <= command.length) {
            setDisplayedCommand(command.substring(0, index));
            setTimeout(() => typeCommand(index + 1), 50);
        } else {
            setIsCommandComplete(true);
        }
    }
    typeCommand();
  }, [questionIndex, command]);
  
  useEffect(() => {
    if(!isCommandComplete || questions.length === 0) return;

    const questionCycleInterval = setInterval(() => {
        setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 5000); // 5 second interval

    return () => clearInterval(questionCycleInterval);
  }, [isCommandComplete, questions.length])

  const displayedQuestion = questions.length > 0 ? questions[questionIndex] : null;

  return (
    <div className="bg-card border border-primary/50 rounded-none p-3 md:p-4 font-code text-xs md:text-sm w-full mx-auto shadow-none min-h-[180px] sm:min-h-[200px] md:min-h-[240px] flex flex-col">
      <div className="flex items-center pb-2 mb-2 border-b border-border/50">
        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div className="flex min-h-[40px]">
        <span className="text-primary shrink-0">user@tws-community:~$</span>
        <div className="ml-2 flex-1">
          <span className="break-all">{displayedCommand}</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" aria-hidden="true"></span>
        </div>
      </div>
       <div className="mt-2 text-left flex-grow overflow-y-auto max-h-[300px] md:max-h-[400px]">
           {isCommandComplete && displayedQuestion && (
            <div className="transition-opacity duration-500 ease-in-out" style={{ opacity: 1 }}>
                <p className="text-primary truncate text-sm md:text-base">{`> ${displayedQuestion.question}`}</p>
                 <div className="mt-2 pl-4 border-l-2 border-primary/30 text-muted-foreground">
                    <div className="max-h-[200px] overflow-y-auto text-sm md:text-base">
                        <p dangerouslySetInnerHTML={{ __html: displayedQuestion.answer || 'Answer not provided.'}} />
                    </div>
                </div>
            </div>
           )}
       </div>
    </div>
  );
}
