import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Lazily initialize AI to avoid failing builds when env var is absent.
// Callers should use getAI() only when GOOGLE_AI_API_KEY is configured.
let cachedAi: ReturnType<typeof genkit> | null = null;

export function getAI() {
  if (cachedAi) return cachedAi;
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing required environment variable: GOOGLE_AI_API_KEY');
  }
  cachedAi = genkit({
    plugins: [googleAI({ apiKey })],
    model: 'googleai/gemini-2.0-flash',
  });
  return cachedAi;
}
