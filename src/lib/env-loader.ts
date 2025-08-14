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
        // Silent error handling for production
      }
    }
    
    // Also load standard .env files (lower priority)
    config({ override: false });
    
    // Mark as loaded to prevent multiple loads
    process.env.ENV_LOADED = 'true';
    

    
  } catch (error) {
    // Silent error handling for production
  }
}

export {};