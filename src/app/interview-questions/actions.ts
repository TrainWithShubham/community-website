"use server";

import { intelligentQuestionSearch } from "@/ai/flows/intelligent-question-search";
import type { Question } from "@/data/questions";

export async function handleSearch(
  query: string,
  questionType: "interview" | "scenario" | "live" | "community",
  questions: Question[]
): Promise<Question[]> {
  if (!query) {
    return [];
  }
  try {
    const response = await intelligentQuestionSearch({
      query,
      questionType,
      questions,
    });
    return response;
  } catch (error) {
    console.error("Error during intelligent search:", error);
    return [];
  }
}
