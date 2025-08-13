import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: 1000 * 60 * 60, // 1 hour
});

export function rateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const requests = rateLimitCache.get(identifier) || [];
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  rateLimitCache.set(identifier, recentRequests);
  return true; // Allowed
}

export function getRateLimitInfo(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const requests = rateLimitCache.get(identifier) || [];
  const recentRequests = requests.filter(time => time > windowStart);
  
  return {
    remaining: Math.max(0, limit - recentRequests.length),
    reset: windowStart + windowMs,
    limit,
  };
}
