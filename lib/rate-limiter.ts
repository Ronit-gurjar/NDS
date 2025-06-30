// lib/rate-limiter.ts
import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server'; // Keep NextRequest for type hinting headers

// Define the options for the LRU cache
type Options = {
  uniqueTokenPerInterval?: number; // Max requests per interval
  interval?: number; // Time window in milliseconds
};

export const getRateLimiter = (options?: Options) => {
  const defaultOptions = {
    uniqueTokenPerInterval: 5, // Default: 5 requests
    interval: 60 * 1000, // Default: 60 seconds (1 minute)
  };

  const opts = { ...defaultOptions, ...options };

  // Use LRUCache to store request counts per IP
  const tokenCache = new LRUCache<string, { count: number; lastReset: number }>({
    max: opts.uniqueTokenPerInterval || 500,
    ttl: opts.interval,
    updateAgeOnGet: false,
  });

  return {
    check: async (request: NextRequest) => {
      // Corrected IP address retrieval: Prioritize 'x-forwarded-for'
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

      // If for some reason 'x-forwarded-for' is comma-separated (e.g., multiple proxies),
      // take the first IP in the list (which should be the client's original IP)
      const clientIp = ip.split(',')[0].trim();

      const now = Date.now();

      let ipEntry = tokenCache.get(clientIp);

      if (!ipEntry || (now - ipEntry.lastReset) >= opts.interval) {
        ipEntry = { count: 1, lastReset: now };
        tokenCache.set(clientIp, ipEntry);
        return { success: true, message: 'Request allowed' };
      }

      ipEntry.count++;
      tokenCache.set(clientIp, ipEntry);

      if (ipEntry.count > opts.uniqueTokenPerInterval!) {
        return { success: false, message: 'Too many requests. Please try again later.', retryAfter: opts.interval - (now - ipEntry.lastReset) };
      }

      return { success: true, message: 'Request allowed' };
    },
  };
};

export const loginRateLimiter = getRateLimiter({ uniqueTokenPerInterval: 5, interval: 5 * 60 * 1000 }); // 5 requests every 5 minutes
export const signupRateLimiter = getRateLimiter({ uniqueTokenPerInterval: 3, interval: 10 * 60 * 1000 }); // 3 requests every 10 minutes