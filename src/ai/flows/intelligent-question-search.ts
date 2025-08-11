'use server';

/**
 * @fileOverview Implements an AI-powered search tool for interview questions, allowing users to efficiently find questions related to specific technologies.
 *
 * - intelligentQuestionSearch - A function that searches for interview questions based on a query.
 * - IntelligentQuestionSearchInput - The input type for the intelligentQuestionSearch function.
 * - IntelligentQuestionSearchOutput - The return type for the intelligentQuestionSearch function.
 */

import { getAI } from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentQuestionSearchInputSchema = z.object({
  query: z.string().describe('The search query to find relevant interview questions.'),
  questionType: z.enum(['interview', 'scenario', 'live', 'community']).describe('The type of question to search for.'),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string().optional(),
    author: z.string().optional(),
  })).describe('An array of interview questions to search through.'),
});

export type IntelligentQuestionSearchInput = z.infer<typeof IntelligentQuestionSearchInputSchema>;

const IntelligentQuestionSearchOutputSchema = z.array(z.object({
  question: z.string(),
  answer: z.string().optional(),
  author: z.string().optional(),
}));

export type IntelligentQuestionSearchOutput = z.infer<typeof IntelligentQuestionSearchOutputSchema>;

let cachedFlow:
  | null
  | ReturnType<ReturnType<typeof getAI>["defineFlow"]> = null;

function getFlow() {
  if (cachedFlow) return cachedFlow;
  const ai = getAI();
  const prompt = ai.definePrompt({
    name: 'intelligentQuestionSearchPrompt',
    input: { schema: IntelligentQuestionSearchInputSchema },
    output: { schema: IntelligentQuestionSearchOutputSchema },
    prompt: `You are an AI assistant designed to find relevant interview questions based on a user's query.

The user is looking for {{questionType}} questions related to "{{{query}}}".
Please analyze the following list of questions and return only the questions that are highly relevant to the user's query. Include the corresponding answer and author if available.

Questions:\n{{#each questions}}\n- Question: {{{this.question}}}{{#if this.author}} (by {{this.author}}){{/if}}\n  {{#if this.answer}}Answer: {{{this.answer}}}\n  {{/if}}\n{{/each}}

Only return questions that are highly relevant to the query. If no questions are relevant, return an empty array.
Format your output as a JSON array of objects, where each object has a "question", an optional "answer", and an optional "author" field.
`,
  });

  cachedFlow = ai.defineFlow(
    {
      name: 'intelligentQuestionSearchFlow',
      inputSchema: IntelligentQuestionSearchInputSchema,
      outputSchema: IntelligentQuestionSearchOutputSchema,
    },
    async input => {
      const { output } = await prompt(input);
      return output!;
    }
  );
  return cachedFlow;
}

export async function intelligentQuestionSearch(input: IntelligentQuestionSearchInput): Promise<IntelligentQuestionSearchOutput> {
  const flow = getFlow();
  return flow(input);
}
