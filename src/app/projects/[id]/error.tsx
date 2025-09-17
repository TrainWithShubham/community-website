'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ProjectErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectError({ error, reset }: ProjectErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Project page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Project Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We couldn't find the project you're looking for. This might be due to:
          </p>
          <ul className="text-sm text-muted-foreground text-left space-y-1">
            <li>• The project ID is invalid</li>
            <li>• The project has been moved or deleted</li>
            <li>• GitHub API is temporarily unavailable</li>
          </ul>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} className="bg-brand-purple hover:bg-brand-purple/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <a href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
