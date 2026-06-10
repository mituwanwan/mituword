// Mock Request API before importing next/server
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor() {}
  } as any;
}

import { NextRequest } from "next/server";
import { rateLimit, rateLimitResponse } from "../rate-limit";

function createMockRequest(ip: string = "127.0.0.1", pathname: string = "/api/test", method: string = "GET"): NextRequest {
  return {
    ip,
    headers: new Headers(),
    method,
    nextUrl: { pathname } as URL,
  } as unknown as NextRequest;
}

describe("rateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should allow requests within the limit", () => {
    const request = createMockRequest();
    const result = rateLimit(request, { maxRequests: 3, windowMs: 60000 });

    expect(result.success).toBe(true);
    expect(result.limit).toBe(3);
    expect(result.remaining).toBe(2);
  });

  it("should track requests per IP", () => {
    const req1 = createMockRequest("1.1.1.1");
    const req2 = createMockRequest("2.2.2.2");

    rateLimit(req1, { maxRequests: 2 });
    rateLimit(req1, { maxRequests: 2 });

    const result1 = rateLimit(req1, { maxRequests: 2 });
    expect(result1.success).toBe(false);

    const result2 = rateLimit(req2, { maxRequests: 2 });
    expect(result2.success).toBe(true);
  });

  it("should block requests over the limit", () => {
    const request = createMockRequest();
    const options = { maxRequests: 2, windowMs: 60000 };

    rateLimit(request, options);
    rateLimit(request, options);
    const result = rateLimit(request, options);

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should reset the counter after the window expires", () => {
    const request = createMockRequest();
    const options = { maxRequests: 1, windowMs: 60000 };

    rateLimit(request, options);
    const blocked = rateLimit(request, options);
    expect(blocked.success).toBe(false);

    jest.advanceTimersByTime(61000);

    const reset = rateLimit(request, options);
    expect(reset.success).toBe(true);
    expect(reset.remaining).toBe(0);
  });

  it("should use x-forwarded-for header when available", () => {
    const request = createMockRequest("127.0.0.1");
    request.headers.set("x-forwarded-for", "192.168.1.1, 10.0.0.1");

    const result = rateLimit(request, { maxRequests: 1 });
    expect(result.success).toBe(true);

    // Second request from same forwarded IP should be blocked
    const result2 = rateLimit(request, { maxRequests: 1 });
    expect(result2.success).toBe(false);
  });

  it("should support custom identifier for different actions", () => {
    const request = createMockRequest("1.1.1.1", "/api/diaries", "POST");

    rateLimit(request, { maxRequests: 1, identifier: "like" });
    const likeBlocked = rateLimit(request, { maxRequests: 1, identifier: "like" });
    expect(likeBlocked.success).toBe(false);

    const commentAllowed = rateLimit(request, { maxRequests: 1, identifier: "comment" });
    expect(commentAllowed.success).toBe(true);
  });
});

describe("rateLimitResponse", () => {
  it("should return null when request is allowed", () => {
    const request = createMockRequest();
    const response = rateLimitResponse(request, { maxRequests: 5 });
    expect(response).toBeNull();
  });

  it("should return 429 response when rate limited", async () => {
    const request = createMockRequest();
    const options = { maxRequests: 1, windowMs: 60000 };

    rateLimitResponse(request, options);
    const response = rateLimitResponse(request, options);

    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);

    const body = await response!.json();
    expect(body.error).toBe("Too many requests");
    expect(body.retryAfter).toBeGreaterThan(0);

    expect(response!.headers.get("X-RateLimit-Limit")).toBe("1");
    expect(response!.headers.get("X-RateLimit-Remaining")).toBe("0");
  });
});
