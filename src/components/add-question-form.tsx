"use client"

import { ReactNode, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

const formSchema = z.object({
  author: z.string().min(2, "Author name is required."),
  questionType: z.enum(["interview", "mcq", "scenario"]),
  question: z.string().min(10, "Question must be at least 10 characters."),
  answer: z.string().optional(),
  mcqOptions: z.array(z.object({ value: z.string().min(1, "Option cannot be empty.") })).optional(),
  correctMcqAnswer: z.string().optional(),
  summary: z.string().optional(),
  diagnosisSteps: z.string().optional(),
  rootCause: z.string().optional(),
  fix: z.string().optional(),
  lessonLearned: z.string().optional(),
  howToAvoid: z.string().optional(),
}).refine(data => {
    if (data.questionType === "interview") return !!data.answer && data.answer.length > 0;
    return true;
}, { message: "Answer is required for interview questions.", path: ["answer"]})
.refine(data => {
    if (data.questionType === "mcq") return data.mcqOptions && data.mcqOptions.length >= 2;
    return true;
}, { message: "MCQs must have at least 2 options.", path: ["mcqOptions"]})
.refine(data => {
    if (data.questionType === "mcq") return !!data.correctMcqAnswer;
    return true;
}, { message: "You must select a correct answer for an MCQ.", path: ["correctMcqAnswer"]});


export function AddQuestionForm({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      questionType: "interview",
      question: "",
      answer: "",
      mcqOptions: [{ value: "" }, { value: "" }],
    },
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mcqOptions",
  });

  const questionType = form.watch("questionType")

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted. In a real application, this would write to the Google Sheet via a backend service.", values);
    toast({
      title: "Question Submitted!",
      description: "Thank you for your contribution. Your question is pending review.",
    })
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-none">
        <DialogHeader>
          <DialogTitle>Add a Community Question</DialogTitle>
          <DialogDescription>
            Contribute to the community by adding a question. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="interview">Interview Question</SelectItem>
                      <SelectItem value="mcq">MCQ</SelectItem>
                      <SelectItem value="scenario">Scenario-Based</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder={questionType === 'scenario' ? "Briefly describe the scenario or problem." : "Enter the question."} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionType === 'interview' && (
               <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain the answer here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}

            {questionType === 'mcq' && (
                <div className="space-y-4">
                    <FormLabel>MCQ Options</FormLabel>
                    {fields.map((field, index) => (
                       <FormField
                          key={field.id}
                          control={form.control}
                          name={`mcqOptions.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                               <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input placeholder={`Option ${index + 1}`} {...field} />
                                  </FormControl>
                                  {fields.length > 2 && (
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                               </div>
                               <FormMessage />
                            </FormItem>
                          )}
                        />
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => append({ value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                    </Button>

                    <FormField
                      control={form.control}
                      name="correctMcqAnswer"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Correct Answer</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {form.getValues('mcqOptions')?.map((option, index) => option.value && (
                                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.value} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.value}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            )}

             {questionType === 'scenario' && (
                <div className="space-y-4">
                   <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Summary</FormLabel>
                          <FormControl><Textarea placeholder="Provide a brief summary of the situation." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diagnosisSteps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosis Steps</FormLabel>
                          <FormControl><Textarea placeholder="What steps were taken to diagnose the issue?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rootCause"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Root Cause</FormLabel>
                          <FormControl><Textarea placeholder="What was the final root cause?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fix</FormLabel>
                          <FormControl><Textarea placeholder="What was the fix for the issue?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lessonLearned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lesson Learned</FormLabel>
                          <FormControl><Textarea placeholder="What was the key takeaway from this scenario?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="howToAvoid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How to Avoid in Future</FormLabel>
                          <FormControl><Textarea placeholder="What can be done to prevent this from happening again?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
             )}


            <DialogFooter>
              <Button type="submit" className="rounded-none">Submit Question</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
