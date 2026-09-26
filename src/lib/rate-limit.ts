// API Rate Limiting Middleware
// Simple in-memory rate limiter for API routes

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
};

export function rateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { success: boolean; remaining: number; resetTime: number; message?: string } {
  const { windowMs, maxRequests, message } = { ...defaultConfig, ...config };
  const now = Date.now();
  
  if (!store[identifier]) {
    store[identifier] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  const record = store[identifier];

  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count++;

  if (record.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: message || defaultConfig.message
    };
  }

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 60 * 1000); // Clean up every minute

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

// Rate limit presets
export const RATE_LIMITS = {
  strict: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  standard: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  relaxed: { windowMs: 60 * 60 * 1000, maxRequests: 500 }, // 500 requests per hour
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 login attempts per 15 minutes
};
