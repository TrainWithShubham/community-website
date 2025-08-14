import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type QuestionCardProps = {
  question: string;
  answer?: string;
  author?: string;
};

export function QuestionCard({ question, answer, author }: QuestionCardProps) {
  return (
    <div className="w-full mb-4">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-card/90 backdrop-blur-sm border border-border shadow-xl rounded-lg p-6 card-neo-border transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
      >
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-left hover:no-underline rounded-none group">
            <div className='flex flex-col text-left w-full'>
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <p className="text-lg md:text-xl font-mono text-foreground">
                    <span className="text-primary mr-2">$</span> 
                    {question}
                  </p>
                  {author && (
                    <p className="text-xs text-muted-foreground mt-2 text-left">
                      - Contributed by {author}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground prose dark:prose-invert max-w-full mt-4">
            {answer ? (
              <div 
                className="pl-4 border-l-2 border-primary/40 prose-p:my-0 prose-p:mb-2"
                dangerouslySetInnerHTML={{ __html: answer }} 
              />
            ) : (
              <p className="text-muted-foreground italic">Answer not available.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
