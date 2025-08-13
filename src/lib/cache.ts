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
  const cached = await caches.open('tws-cache');
  const response = await cached.match(key);
  
  if (response) {
    const data = await response.json();
    const timestamp = data.timestamp;
    const age = Date.now() - timestamp;
    
    if (age < revalidateSeconds * 1000) {
      return data.value;
    }
  }
  
  try {
    const freshData = await fetcher();
    const cacheData = {
      value: freshData,
      timestamp: Date.now(),
    };
    
    await cached.put(key, new Response(JSON.stringify(cacheData)));
    return freshData;
  } catch (error) {
    // Return cached data if available, even if stale
    if (response) {
      const data = await response.json();
      return data.value;
    }
    throw error;
  }
}
