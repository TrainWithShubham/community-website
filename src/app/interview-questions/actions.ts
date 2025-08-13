"use server";

import { intelligentQuestionSearch } from "@/ai/flows/intelligent-question-search";
import { rateLimit } from "@/lib/rate-limit";
import { trackError, trackEvent } from "@/lib/monitoring";
import type { Question } from "@/data/questions";

export async function handleSearch(
  query: string,
  questionType: "interview" | "scenario" | "live" | "community",
  questions: Question[],
  userId?: string
): Promise<Question[]> {
  if (!query) {
    return [];
  }

  // Rate limiting
  const identifier = userId || 'anonymous';
  if (!rateLimit(identifier, 10, 60000)) { // 10 requests per minute
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    trackEvent('ai_search', { query, questionType, userId });
    
    const response = await intelligentQuestionSearch({
      query,
      questionType,
      questions,
    });
    
    return response;
  } catch (error) {
    trackError(error as Error, 'intelligent-search');
    console.error("Error during intelligent search:", error);
    return [];
  }
}
