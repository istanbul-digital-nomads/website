// Rate limiter with two backends:
//
// 1. Upstash (distributed) - used when UPSTASH_REDIS_REST_URL and
//    UPSTASH_REDIS_REST_TOKEN are set. This is the production path.
//    Buckets are shared across all Vercel function instances, so it
//    stops distributed abuse (an attacker spraying across regions
//    can't bypass by hitting fresh lambdas).
//
// 2. In-memory fallback - used in local dev and as a safety net if
//    Upstash is unreachable. Buckets live in module scope per function
//    instance; stops casual single-client abuse but not distributed.
//
// Both backends share the same RateLimitResult shape and header helpers.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

let redisClient: Redis | null = null;
function getRedis() {
  if (!redisClient) redisClient = Redis.fromEnv();
  return redisClient;
}

// One Ratelimit instance per (limit, windowMs) combo. The Upstash SDK keys
// by its own prefix, so we can reuse instances across callers that share
// the same budget.
const upstashInstances = new Map<string, Ratelimit>();
function getUpstashLimiter(limit: number, windowMs: number) {
  const key = `${limit}:${windowMs}`;
  let inst = upstashInstances.get(key);
  if (!inst) {
    inst = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "rl",
      analytics: false,
    });
    upstashInstances.set(key, inst);
  }
  return inst;
}

type Bucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, Bucket>();

let memoryCalls = 0;
function memoryGc(now: number) {
  for (const [k, b] of memoryBuckets) {
    if (b.resetAt <= now) memoryBuckets.delete(k);
  }
}

function inMemoryLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  memoryCalls = (memoryCalls + 1) % 100;
  if (memoryCalls === 0) memoryGc(now);

  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryBuckets.set(key, { count: 1, resetAt });
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

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (!upstashConfigured) return inMemoryLimit(key, limit, windowMs);

  try {
    const limiter = getUpstashLimiter(limit, windowMs);
    const result = await limiter.limit(key);
    const now = Date.now();
    return {
      allowed: result.success,
      remaining: Math.max(0, result.remaining),
      retryAfterSeconds: result.success
        ? 0
        : Math.max(1, Math.ceil((result.reset - now) / 1000)),
      resetAt: result.reset,
    };
  } catch (err) {
    // Never block a legitimate request because of a rate-limit infrastructure
    // failure. Fall back to the in-memory limiter so we still stop local
    // tight loops even if Upstash is down.
    console.warn("Upstash rate limit failed, falling back to memory:", err);
    return inMemoryLimit(key, limit, windowMs);
  }
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
    "X-RateLimit-Backend": upstashConfigured ? "upstash" : "memory",
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}
