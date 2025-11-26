import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type QuestionCardProps = {
  question: string;
  answer?: string;
  author?: string;
};

export function QuestionCard({ question, answer, author }: QuestionCardProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card/80 backdrop-blur-sm border border-secondary hover:border-primary transition-colors rounded-lg p-6"
    >
    <AccordionItem value="item-1" className="border-b-0">
    <AccordionTrigger className="text-left hover:no-underline hover:bg-secondary/30 rounded-md">
            <div className='flex flex-col text-left w-full'>
                <p className="text-lg md:text-xl"><span className="text-primary mr-2">$</span> {question}</p>
                {author && (
                    <p className="text-xs text-muted-foreground mt-2 text-left">
                        - Contributed by {author}
                    </p>
                )}
            </div>
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground prose dark:prose-invert max-w-full mt-4">
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
