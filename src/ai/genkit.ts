import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Validate Google AI API key
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('Missing required environment variable: GOOGLE_AI_API_KEY');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
  })],
  model: 'googleai/gemini-2.0-flash',
});
