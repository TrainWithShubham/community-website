"use client"
import { useState, useEffect, useRef } from 'react'
import { type Job } from '@/data/jobs'

interface JobsTerminalAnimationProps {
    jobs: Job[];
}

export function JobsTerminalAnimation({ jobs }: JobsTerminalAnimationProps) {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [displayedJob, setDisplayedJob] = useState<Job | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'typing' | 'executing' | 'displaying' | 'transitioning'>('idle');
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const command = 'cat /var/log/jobs/';
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
    if (jobs.length === 0) return;

    clearAllTimeouts();
    
    const startAnimation = () => {
      // Reset state
      setAnimationPhase('idle');
      setDisplayedCommand('');
      setShowCursor(true);
      setDisplayedJob(null);
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
          setDisplayedJob(jobs[currentJobIndex]);
        }, executionDelay);
        timeoutRefs.current.push(executionTimeout);
      }
    };

    const transitionToNext = () => {
      setAnimationPhase('transitioning');
      
      const transitionTimeout = setTimeout(() => {
        setCurrentJobIndex(prev => (prev + 1) % jobs.length);
      }, transitionDelay);
      timeoutRefs.current.push(transitionTimeout);
    };

    // Start the animation cycle
    startAnimation();

    // Cleanup function
    return clearAllTimeouts;
  }, [currentJobIndex, jobs.length]); 

  // Handle transition to next job
  useEffect(() => {
    if (animationPhase === 'displaying' && displayedJob) {
      const displayTimeout = setTimeout(() => {
        setAnimationPhase('transitioning');
        
        const transitionTimeout = setTimeout(() => {
          setCurrentJobIndex(prev => (prev + 1) % jobs.length);
        }, transitionDelay);
        timeoutRefs.current.push(transitionTimeout);
      }, displayDuration);
      timeoutRefs.current.push(displayTimeout);
    }
  }, [animationPhase, displayedJob, jobs.length, displayDuration, transitionDelay]);

  if (jobs.length === 0) {
    return (
      <div className="h-[280px] md:h-[320px] lg:h-[360px] bg-card border border-primary/50 rounded-lg overflow-hidden card-neo-border">
        <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-sm font-medium text-muted-foreground">
            JobBoard Terminal
          </div>
        </div>
        <div className="p-4 h-full overflow-y-auto bg-card text-sm font-mono">
          <div className="text-muted-foreground">user@tws-community:~$ No jobs available</div>
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
          JobBoard Terminal
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
          
          {/* Job output with fade-in animation */}
          {animationPhase === 'displaying' && displayedJob && (
            <div className="mt-4 space-y-3 text-foreground animate-in fade-in duration-500">
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary shadow-sm">
                <div className="font-semibold text-primary text-base mb-2">{displayedJob.title}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Company:</span> {displayedJob.company}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Location:</span> {displayedJob.location}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Experience:</span> {displayedJob.experience}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Type:</span> {displayedJob.type}
                  </div>
                </div>
                <div className="text-muted-foreground text-sm mt-2">
                  <span className="font-medium">Posted:</span> {displayedJob.postedDate}
                </div>
                <div className="mt-3">
                  <a 
                    href={displayedJob.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Transition indicator */}
          {animationPhase === 'transitioning' && (
            <div className="text-muted-foreground transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <span>Loading next job...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
