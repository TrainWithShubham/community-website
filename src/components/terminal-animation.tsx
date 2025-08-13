"use client"
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const commands = [
  // Git Commands
  'git clone https://github.com/trainwithshubham/tws-community.git',
  'git checkout -b new-feature',
  'git add .',
  'git commit -m "feat: implement terminal animation"',
  'git push origin new-feature',
  'git pull --rebase',
  'git log --oneline --graph',
  'gh pr create --title "My New Feature" --body "Here are the details."',
  
  // Docker Commands
  'docker build -t tws-app .',
  'docker run -p 3000:3000 tws-app',
  'docker images',
  'docker ps -a',
  'docker push trainwithshubham/tws-app:latest',
  'docker-compose up -d',

  // Linux Commands
  'ls -la',
  'cd /var/log',
  'cat syslog | grep "ERROR"',
  'chmod +x setup.sh',
  './setup.sh',

  // Kubernetes Commands
  'kubectl get pods -n production',
  'kubectl describe pod my-app-xyz123 -n production',
  'kubectl logs -f my-app-xyz123 -n production',
  'kubectl apply -f deployment.yaml',
  'kubectl rollout status deployment/my-app',
  'kubectl scale deployment my-app --replicas=3',
  'kubectl config get-contexts',
  'kubectl config use-context staging-cluster',

  // ArgoCD Commands
  'argocd app list',
  'argocd app get my-app',
  'argocd app sync my-app',
  'argocd app history my-app',

  // Terraform Commands
  'terraform init',
  'terraform plan',
  'terraform apply --auto-approve',
];

const keywordColors: { [key: string]: string } = {
  // Git
  'git': 'text-red-400',
  'clone': 'text-purple-400',
  'checkout': 'text-purple-400',
  'add': 'text-purple-400',
  'commit': 'text-purple-400',
  'push': 'text-purple-400',
  'pull': 'text-purple-400',
  'log': 'text-purple-400',
  'rebase': 'text-yellow-400',
  'origin': 'text-yellow-400',
  'new-feature': 'text-green-400',
  '-b': 'text-cyan-400',
  '-m': 'text-cyan-400',
  '--oneline': 'text-cyan-400',
  '--graph': 'text-cyan-400',
  
  // GH CLI
  'gh': 'text-pink-400',
  'pr': 'text-purple-400',
  'create': 'text-purple-400',
  '--title': 'text-cyan-400',
  '--body': 'text-cyan-400',

  // Docker
  'docker': 'text-blue-400',
  'build': 'text-purple-400',
  'run': 'text-purple-400',
  'images': 'text-purple-400',
  'ps': 'text-purple-400',
  'docker-push': 'text-purple-400',
  'docker-compose': 'text-blue-400',
  'up': 'text-purple-400',
  '-t': 'text-cyan-400',
  '-p': 'text-cyan-400',
  '-a': 'text-cyan-400',
  '-d': 'text-cyan-400',
  
  // Linux
  'ls': 'text-green-400',
  'cd': 'text-green-400',
  'cat': 'text-green-400',
  'grep': 'text-red-400',
  'chmod': 'text-green-400',
  './setup.sh': 'text-yellow-400',
  '-la': 'text-cyan-400',
  '+x': 'text-cyan-400',

  // Kubernetes
  'kubectl': 'text-indigo-400',
  'get': 'text-purple-400',
  'describe': 'text-purple-400',
  'logs': 'text-purple-400',
  'apply': 'text-purple-400',
  'rollout': 'text-purple-400',
  'status': 'text-yellow-400',
  'scale': 'text-purple-400',
  'config': 'text-yellow-400',
  'use-context': 'text-yellow-400',
  'pods': 'text-green-400',
  'pod': 'text-green-400',
  'deployment': 'text-green-400',
  'production': 'text-red-400',
  '-n': 'text-cyan-400',
  '-f': 'text-cyan-400',
  '--replicas=3': 'text-cyan-400',
  
  // ArgoCD
  'argocd': 'text-orange-400',
  'app': 'text-purple-400',
  'list': 'text-yellow-400',
  'sync': 'text-yellow-400',
  'history': 'text-yellow-400',

  // Terraform
  'terraform': 'text-purple-500',
  'init': 'text-yellow-400',
  'plan': 'text-yellow-400',
  '--auto-approve': 'text-cyan-400',
};


const renderColoredCommand = (command: string) => {
  const parts = command.split(/(\s+|"[^"]*"|'[^']*'|\S+)/g).filter(Boolean);
  return parts.map((part, i) => {
    const colorClass = keywordColors[part.trim()] || 'text-foreground';
    if (part.startsWith('"') && part.endsWith('"')) {
      return <span key={i} className="text-yellow-300">{part}</span>;
    }
    if (part.startsWith('http')) {
        return <span key={i} className="text-teal-300">{part}</span>
    }
    if (part === '|') {
        return <span key={i} className="text-red-500 font-bold">{part}</span>
    }
    return <span key={i} className={cn(colorClass)}>{part}</span>;
  });
};

export function TerminalAnimation() {
  const [currentLine, setCurrentLine] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    const currentCommand = commands[commandIndex];
    
    const type = (index = 0) => {
      if (index <= currentCommand.length) {
        setCurrentLine(currentCommand.substring(0, index));
        typingTimeout = setTimeout(() => type(index + 1), 50 + Math.random() * 50);
      } else {
        // Pause at the end of the line, then move to the next command
        typingTimeout = setTimeout(() => {
          setCommandIndex((prevIndex) => (prevIndex + 1) % commands.length);
        }, 2000);
      }
    };

    type();

    return () => clearTimeout(typingTimeout);
  }, [commandIndex]);

  return (
    <div className="bg-card border border-primary/50 rounded-none p-3 md:p-4 font-code text-xs md:text-sm w-full max-w-full mx-auto shadow-none h-[120px] md:h-[140px] flex flex-col">
      <div className="flex items-center pb-2 mb-2 border-b border-border/50">
        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <span className="text-primary shrink-0">user@tws-community:~$</span>
        <div className="ml-2 flex-1 relative">
          <span className="break-all leading-relaxed">{renderColoredCommand(currentLine)}</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  );
}
