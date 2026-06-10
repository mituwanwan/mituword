import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip || "unknown";
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

export function rateLimit(
  request: NextRequest,
  options: {
    maxRequests?: number;
    windowMs?: number;
    identifier?: string;
  } = {}
): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const { maxRequests = 60, windowMs = DEFAULT_WINDOW_MS, identifier } = options;
  const clientIp = getClientIp(request);
  const key = identifier ? `${clientIp}:${identifier}` : `${clientIp}:${request.method}:${request.nextUrl.pathname}`;

  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up expired entries periodically (roughly every 100 requests)
  if (rateLimitStore.size > 100 && Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  if (!record || record.resetAt < now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetAt: newRecord.resetAt,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

export function rateLimitResponse(
  request: NextRequest,
  options?: {
    maxRequests?: number;
    windowMs?: number;
    identifier?: string;
  }
): NextResponse | null {
  const result = rateLimit(request, options);

  if (!result.success) {
    const resetSeconds = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `请求过于频繁，请在 ${resetSeconds} 秒后重试`,
        retryAfter: resetSeconds,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
          "Retry-After": String(resetSeconds),
        },
      }
    );
  }

  return null;
}
