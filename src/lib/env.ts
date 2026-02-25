// Ensure environment variables are loaded first
import './env-loader';
import { z } from 'zod';

// Default Google Sheets URL for Jobs only
const DEFAULT_JOBS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXG1tfJqAN5IqlJqpvPWnOMVlCEKCYIgSfddrb30wZndYyn4rl2KSznKhx8D1GvdJmG040p1KA983u/pub?output=csv';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Google Sheets - Jobs only (Interview questions now use GitHub CSV)
  JOBS_SHEET_URL: z.string().url().min(1).default(DEFAULT_JOBS_SHEET_URL),
  
  // GitHub CSV - Interview Questions (public, no auth needed)
  NEXT_PUBLIC_INTERVIEW_REPO_OWNER: z.string().default('TrainWithShubham'),
  NEXT_PUBLIC_INTERVIEW_REPO_NAME: z.string().default('interview-questions'),
  NEXT_PUBLIC_INTERVIEW_REPO_BRANCH: z.string().default('main'),
});

// Safe environment parsing with fallbacks
function parseEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    // Merge process.env with defaults for missing values
    const envWithDefaults = {
      ...process.env,
      JOBS_SHEET_URL: process.env.JOBS_SHEET_URL || DEFAULT_JOBS_SHEET_URL,
    };
    
    return envSchema.parse(envWithDefaults);
  }
}

export const env = parseEnvironment();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Enhanced validation function with detailed error reporting
export function validateEnvironment(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const warnings: string[] = [];
  
  try {
    envSchema.parse(process.env);
    
    // Check if we're using default Jobs sheet URL
    if (!process.env.JOBS_SHEET_URL) {
      warnings.push('JOBS_SHEET_URL: Missing from environment, using default');
    } else if (process.env.JOBS_SHEET_URL === DEFAULT_JOBS_SHEET_URL) {
      warnings.push('JOBS_SHEET_URL: Using production default value');
    }
    
    // Check GitHub CSV configuration
    if (!process.env.NEXT_PUBLIC_INTERVIEW_REPO_OWNER) {
      warnings.push('NEXT_PUBLIC_INTERVIEW_REPO_OWNER: Using default (TrainWithShubham)');
    }
    
    return { isValid: true, errors: [], warnings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors, warnings };
    }
    const errorMessage = 'Unknown validation error';
    return { isValid: false, errors: [errorMessage], warnings };
  }
}

// Helper function to get sheet URLs with type safety
// Note: Interview questions now use GitHub CSV (see src/services/github-csv.ts)
export function getSheetUrls() {
  return {
    jobs: env.JOBS_SHEET_URL, // Only Jobs still uses Google Sheets
  };
}




