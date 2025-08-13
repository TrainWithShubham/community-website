// Ensure environment variables are loaded first
import './env-loader';
import { z } from 'zod';

// Default Google Sheets URLs as fallback
const DEFAULT_SHEET_URLS = {
  SCENARIO_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUrAU7tRsTjLa2B9nYV5yz4x3gcYLf38ofVM0haSMKZ3XFq-FHwDQiIGntWYH1oEeWJXMQPeHnm3WN/pub?output=csv',
  INTERVIEW_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKXulHlDEFD1f3mVxbNgtk5_qfewFBIIN0s-XOYXXhOa2W-T9mmkvmbZi_SMqk0EpUhZbpFKhOMZDh/pub?output=csv',
  LIVE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTX8qvtRs3zOsCtecGKHtcrqAAq8akht-drKxmkxCFBxxYEwWiG1_gqR8TY1fT757wqDIrzviEdbUpj/pub?output=csv',
  COMMUNITY_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTS9P-csRa0DxN4W3DYQ-Jd1216fI0EhUmKEeBVhDNOgZmVTJPxTUFbY52SjpuORhaHYRkkc66IYLsD/pub?output=csv',
  LEADERBOARD_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQl3-ej0Y-Y6apt3lJOpnj1y9B6wXcxqOi3OLCQJ-sDeEoWVUc3Kz12F8p3cYixrwjpzYLjds790La4/pub?output=csv',
  JOBS_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXG1tfJqAN5IqlJqpvPWnOMVlCEKCYIgSfddrb30wZndYyn4rl2KSznKhx8D1GvdJmG040p1KA983u/pub?output=csv',
  COMMUNITY_STATS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRX5qvUPTswosvphvap35loiZh754Enf45-A-IH3qNbxlVJY7oOqtD1YehFU9mXb8dStOq4vjA8CESX/pub?output=csv',
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  
  // Google AI Configuration
  GOOGLE_AI_API_KEY: z.string().min(1).optional(),
  
  // Google Sheets API Configuration
  GOOGLE_SHEETS_PROJECT_ID: z.string().min(1).optional(),
  GOOGLE_SHEETS_CLIENT_EMAIL: z.string().email().optional(),
  GOOGLE_SHEETS_PRIVATE_KEY: z.string().min(1).optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1).optional(),
  
  // Google Sheets Configuration with fallbacks
  SCENARIO_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.SCENARIO_SHEET_URL),
  INTERVIEW_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.INTERVIEW_SHEET_URL),
  LIVE_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.LIVE_SHEET_URL),
  COMMUNITY_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.COMMUNITY_SHEET_URL),
  LEADERBOARD_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.LEADERBOARD_SHEET_URL),
  JOBS_SHEET_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.JOBS_SHEET_URL),
  COMMUNITY_STATS_URL: z.string().url().min(1).default(DEFAULT_SHEET_URLS.COMMUNITY_STATS_URL),
});

// Safe environment parsing with fallbacks
function parseEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.warn('Environment validation failed, using fallback values:', error);
    // Merge process.env with defaults for missing values
    const envWithDefaults = { ...process.env };
    
    // Add missing sheet URLs with defaults
    Object.entries(DEFAULT_SHEET_URLS).forEach(([key, defaultValue]) => {
      if (!envWithDefaults[key]) {
        envWithDefaults[key] = defaultValue;
        console.warn(`Using default value for ${key}`);
      }
    });
    
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
    
    // Check if we're using default values
    Object.entries(DEFAULT_SHEET_URLS).forEach(([key, defaultValue]) => {
      const envValue = process.env[key];
      if (!envValue) {
        warnings.push(`${key}: Missing from environment, using default`);
      } else if (envValue === defaultValue) {
        warnings.push(`${key}: Using production default value`);
      }
    });
    
    return { isValid: true, errors: [], warnings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      console.error('Environment validation failed:', errors);
      return { isValid: false, errors, warnings };
    }
    const errorMessage = 'Unknown validation error';
    console.error('Environment validation failed:', errorMessage);
    return { isValid: false, errors: [errorMessage], warnings };
  }
}

// Helper function to get sheet URLs with type safety
export function getSheetUrls() {
  return {
    scenario: env.SCENARIO_SHEET_URL,
    interview: env.INTERVIEW_SHEET_URL,
    live: env.LIVE_SHEET_URL,
    community: env.COMMUNITY_SHEET_URL,
    leaderboard: env.LEADERBOARD_SHEET_URL,
    jobs: env.JOBS_SHEET_URL,
    communityStats: env.COMMUNITY_STATS_URL,
  };
}

// Debug function to help troubleshoot environment issues
export function debugEnvironment() {
  console.log('🔍 Environment Debug Information:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('ENV_LOADED:', process.env.ENV_LOADED);
  
  const sheetVars = [
    'SCENARIO_SHEET_URL',
    'INTERVIEW_SHEET_URL', 
    'LIVE_SHEET_URL',
    'COMMUNITY_SHEET_URL',
    'LEADERBOARD_SHEET_URL',
    'JOBS_SHEET_URL',
    'COMMUNITY_STATS_URL'
  ];
  
  sheetVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}:`, value ? '✅ Set' : '❌ Missing');
  });
  
  const validation = validateEnvironment();
  console.log('Validation result:', validation);
}

// Validate environment on module load (server-side only)
if (typeof window === 'undefined') {
  const validation = validateEnvironment();
  if (!validation.isValid) {
    console.warn('Environment validation warnings:', validation.errors);
    debugEnvironment();
  } else if (validation.warnings.length > 0) {
    console.warn('Environment validation warnings:', validation.warnings);
  }
}
