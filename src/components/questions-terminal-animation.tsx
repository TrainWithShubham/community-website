"use client"
import { useState, useEffect, useRef } from 'react'
import { type Question } from '@/data/questions'

interface QuestionsTerminalAnimationProps {
    questions: Question[];
}

// Function to strip HTML tags from text
function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function QuestionsTerminalAnimation({ questions }: QuestionsTerminalAnimationProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [displayedQuestion, setDisplayedQuestion] = useState<Question | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'typing' | 'executing' | 'displaying' | 'transitioning'>('idle');
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const command = 'cat /var/log/interview_questions.log | head -n 3';
  const typingSpeed = 80;
  const executionDelay = 1200;
  const displayDuration = 4000;
  const transitionDelay = 800;
  
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const commandIndexRef = useRef(0);

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  // Main animation cycle
  useEffect(() => {
    if (questions.length === 0) return;

    clearAllTimeouts();
    
    const startAnimation = () => {
      // Reset state
      setAnimationPhase('idle');
      setDisplayedCommand('');
      setShowCursor(true);
      setDisplayedQuestion(null);
      commandIndexRef.current = 0;

      // Start typing after a short delay
      const typingTimeout = setTimeout(() => {
        setAnimationPhase('typing');
        typeCommand();
      }, 500);
      timeoutRefs.current.push(typingTimeout);
    };

    const typeCommand = () => {
      if (commandIndexRef.current < command.length) {
        setDisplayedCommand(command.substring(0, commandIndexRef.current + 1));
        commandIndexRef.current++;
        
        const nextTimeout = setTimeout(typeCommand, typingSpeed);
        timeoutRefs.current.push(nextTimeout);
      } else {
        // Typing complete, start execution
        setAnimationPhase('executing');
        setShowCursor(false);
        
        const executionTimeout = setTimeout(() => {
          setAnimationPhase('displaying');
          setDisplayedQuestion(questions[currentQuestionIndex]);
        }, executionDelay);
        timeoutRefs.current.push(executionTimeout);
      }
    };

    const transitionToNext = () => {
      setAnimationPhase('transitioning');
      
      const transitionTimeout = setTimeout(() => {
        setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
      }, transitionDelay);
      timeoutRefs.current.push(transitionTimeout);
    };

    // Start the animation cycle
    startAnimation();

    // Cleanup function
    return clearAllTimeouts;
  }, [currentQuestionIndex, questions.length]); // Simplified dependencies

  // Handle transition to next question
  useEffect(() => {
    if (animationPhase === 'displaying' && displayedQuestion) {
      const displayTimeout = setTimeout(() => {
        setAnimationPhase('transitioning');
        
        const transitionTimeout = setTimeout(() => {
          setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
        }, transitionDelay);
        timeoutRefs.current.push(transitionTimeout);
      }, displayDuration);
      timeoutRefs.current.push(displayTimeout);
    }
  }, [animationPhase, displayedQuestion, questions.length, displayDuration, transitionDelay]);

  if (questions.length === 0) {
    return (
      <div className="h-[280px] md:h-[320px] lg:h-[360px] bg-card border border-primary/50 rounded-lg overflow-hidden card-neo-border">
        <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-sm font-medium text-muted-foreground">
            Interview-Questions Terminal
          </div>
        </div>
        <div className="p-4 h-full overflow-y-auto bg-card text-sm font-mono">
          <div className="text-muted-foreground">user@tws-community:~$ No questions available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[280px] md:h-[320px] lg:h-[360px] bg-card border border-primary/50 rounded-lg overflow-hidden card-neo-border">
      {/* macOS-style header */}
      <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-medium text-muted-foreground">
          Interview-Questions Terminal
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 h-full overflow-y-auto bg-card text-sm font-mono">
        <div className="space-y-3">
          {/* Command line with smooth typing */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="select-none">user@tws-community:~$</span>
            <span className="text-foreground font-mono">{displayedCommand}</span>
            {showCursor && animationPhase === 'typing' && (
              <span className="text-foreground animate-pulse">|</span>
            )}
          </div>
          
          {/* Execution status with smooth transitions */}
          {animationPhase === 'executing' && (
            <div className="text-muted-foreground transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Executing command...</span>
              </div>
            </div>
          )}
          
          {/* Question output with fade-in animation */}
          {animationPhase === 'displaying' && displayedQuestion && (
            <div className="mt-4 space-y-3 text-foreground animate-in fade-in duration-500">
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary shadow-sm">
                <div className="font-semibold text-primary text-base mb-3">
                  Q: {displayedQuestion.question}
                </div>
                {displayedQuestion.answer && (
                  <div className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    <span className="font-medium text-foreground">A:</span> {stripHtmlTags(displayedQuestion.answer)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                  <span className="font-medium">Author:</span> {displayedQuestion.author}
                </div>
              </div>
            </div>
          )}
          
          {/* Transition indicator */}
          {animationPhase === 'transitioning' && (
            <div className="text-muted-foreground transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <span>Loading next question...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
