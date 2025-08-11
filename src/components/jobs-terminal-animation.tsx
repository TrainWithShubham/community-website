"use client"
import { useState, useEffect } from 'react';
import { type Job } from '@/data/jobs';

interface JobsTerminalAnimationProps {
    jobs: Job[];
}

export function JobsTerminalAnimation({ jobs }: JobsTerminalAnimationProps) {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [isCommandComplete, setIsCommandComplete] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);

  const command = `ls -l /var/log/jobs`;

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
  }, [jobIndex, command]);
  
  useEffect(() => {
    if(!isCommandComplete || jobs.length === 0) return;

    const jobCycleInterval = setInterval(() => {
        setJobIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    }, 5000); // 5 second interval

    return () => clearInterval(jobCycleInterval);
  }, [isCommandComplete, jobs.length])

  const displayedJob = jobs.length > 0 ? jobs[jobIndex] : null;

  return (
    <div className="bg-card border border-primary/50 rounded-none p-3 md:p-4 font-code text-xs md:text-sm w-full mx-auto shadow-none min-h-[180px] sm:min-h-[200px] md:min-h-[240px] flex flex-col">
      <div className="flex items-center pb-2 mb-2 border-b border-border/50">
        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div className="flex min-h-[40px]">
        <span className="text-primary shrink-0">user@tws-community:~$</span>
        <span className="ml-2 flex-1 relative">
          <span className="break-all">{displayedCommand}</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" aria-hidden="true"></span>
        </span>
      </div>
       <div className="mt-2 text-left flex-grow overflow-y-auto max-h-[300px] md:max-h-[400px]">
           {isCommandComplete && displayedJob && (
            <div className="transition-opacity duration-500 ease-in-out" style={{ opacity: 1 }}>
                <p className="text-sm md:text-base">
                    <span className="text-cyan-400">drwxr-xr-x </span>
                    <span className="text-yellow-400">1 root root 4096 </span>
                    <span className="text-purple-400">{new Date(displayedJob.postedDate).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })} </span>
                    <span className="text-primary">{displayedJob.title.replace(/\s/g, '_')}.log</span>
                </p>
                 <div className="mt-2 pl-4 border-l-2 border-primary/30 text-muted-foreground text-sm md:text-base">
                    <p><span className="text-accent">Company:</span> {displayedJob.company}</p>
                    <p><span className="text-accent">Location:</span> {displayedJob.location}</p>
                    <p><span className="text-accent">Experience:</span> {displayedJob.experience}</p>
                     <p><span className="text-accent">Type:</span> {displayedJob.type}</p>
                </div>
            </div>
           )}
       </div>
    </div>
  );
}
