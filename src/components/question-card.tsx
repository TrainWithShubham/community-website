import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type QuestionCardProps = {
  question: string;
  answer?: string;
  author?: string;
};

export function QuestionCard({ question, answer, author }: QuestionCardProps) {
  return (
    <Accordion type="single" collapsible className="w-full bg-transparent border border-secondary rounded-none px-4">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="text-left hover:no-underline">
            <div className='flex flex-col text-left w-full'>
                <p><span className="text-primary mr-2">$</span> {question}</p>
                {author && (
                    <p className="text-xs text-muted-foreground mt-2 text-left">
                        - Contributed by {author}
                    </p>
                )}
            </div>
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground prose dark:prose-invert max-w-full">
          {answer ? (
            <div 
              className="pl-4 border-l-2 border-primary/50 prose-p:my-0 prose-p:mb-2"
              dangerouslySetInnerHTML={{ __html: answer }} 
            />
          ) : (
            'Answer not available.'
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
