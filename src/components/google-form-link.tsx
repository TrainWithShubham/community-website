import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface GoogleFormLinkProps {
  formUrl?: string;
  buttonText?: string;
  className?: string;
}

/**
 * Component to link to Google Form for community contributions
 * Replaces Firebase Authentication for question submissions
 */
export function GoogleFormLink({ 
  formUrl = 'https://forms.google.com/your-form-url', 
  buttonText = 'Contribute a Question',
  className 
}: GoogleFormLinkProps) {
  return (
    <Button asChild className={className}>
      <a href={formUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4 mr-2" />
        {buttonText}
      </a>
    </Button>
  );
}
