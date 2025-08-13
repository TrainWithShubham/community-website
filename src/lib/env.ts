import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);

export function validateEnvironment(): boolean {
  try {
    envSchema.parse(process.env);
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
}

// Validate environment on module load
if (typeof window === 'undefined') {
  validateEnvironment();
}
