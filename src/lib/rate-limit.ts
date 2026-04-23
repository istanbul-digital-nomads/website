// Lightweight in-memory rate limiter, keyed by caller-supplied string (typically
// `<route>:<ip>`). Buckets live in module scope so they persist between requests
// handled by the same serverless instance, but NOT across instances - Vercel may
// scale to many concurrent lambdas and this limiter does not sync between them.
// It stops casual abuse (one client in a tight loop) but is not a security
// boundary. For that, swap to Upstash Ratelimit or Vercel KV.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistically drop expired buckets on every ~100th call to keep memory
// bounded even under a wide key distribution.
let calls = 0;
function gc(now: number) {
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  calls = (calls + 1) % 100;
  if (calls === 0) gc(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: 0,
      resetAt,
    };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      resetAt: bucket.resetAt,
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: 0,
    resetAt: bucket.resetAt,
  };
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  const real = request.headers.get("x-real-ip");
  return real || "unknown";
}

export function rateLimitHeaders(result: RateLimitResult, limit: number) {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}
