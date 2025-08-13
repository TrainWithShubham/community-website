// Environment loader to ensure .env.local is loaded properly
import { config } from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env.local if not already loaded
if (typeof window === 'undefined' && !process.env.ENV_LOADED) {
  try {
    // Load .env.local first (highest priority)
    const envLocalPath = join(process.cwd(), '.env.local');
    
    if (existsSync(envLocalPath)) {
      const result = config({ path: envLocalPath, override: true });
      if (result.error) {
        console.warn('⚠️  Error loading .env.local:', result.error);
      } else {
        console.log('✅ .env.local loaded successfully');
      }
    } else {
      console.warn('⚠️  .env.local file not found at:', envLocalPath);
    }
    
    // Also load standard .env files (lower priority)
    config({ override: false });
    
    // Mark as loaded to prevent multiple loads
    process.env.ENV_LOADED = 'true';
    
    // Debug: Log a sample variable to verify loading
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Environment debug - SCENARIO_SHEET_URL exists:', !!process.env.SCENARIO_SHEET_URL);
    }
    
  } catch (error) {
    console.warn('⚠️  Could not load environment files:', error);
  }
}

export {};