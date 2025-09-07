// Simple in-memory cache for server-side use
const memoryCache = new Map<string, { value: any; timestamp: number }>();

export const CACHE_KEYS = {
  INTERVIEW_QUESTIONS: 'interview-questions',
  SCENARIO_QUESTIONS: 'scenario-questions',
  LIVE_QUESTIONS: 'live-questions',
  COMMUNITY_QUESTIONS: 'community-questions',
  JOBS: 'jobs',
  LEADERBOARD: 'leaderboard',
  COMMUNITY_STATS: 'community-stats',
} as const;

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  revalidateSeconds: number = 300 // 5 minutes default
): Promise<T> {
  // Check if we have cached data
  const cached = memoryCache.get(key);
  
  if (cached) {
    const age = Date.now() - cached.timestamp;
    
              if (age < revalidateSeconds * 1000) {
            return cached.value;
          }
  }
  
  try {
    const freshData = await fetcher();
    
    // Store in memory cache
    memoryCache.set(key, {
      value: freshData,
      timestamp: Date.now(),
    });
    
    return freshData;
  } catch (error) {
    // Return cached data if available, even if stale
    if (cached) {
      return cached.value;
    }
    throw error;
  }
}

// Function to clear specific cache entries
export function clearCache(key: string): void {
  if (memoryCache.has(key)) {
    memoryCache.delete(key);
  }
}

// Function to clear all cache
export function clearAllCache(): void {
  memoryCache.clear();
}

// Function to get cache status
export function getCacheStatus(): Record<string, { hasData: boolean; age: number }> {
  const status: Record<string, { hasData: boolean; age: number }> = {};
  
  for (const [key, value] of memoryCache.entries()) {
    status[key] = {
      hasData: true,
      age: Date.now() - value.timestamp,
    };
  }
  
  return status;
}
