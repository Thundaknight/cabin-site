import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In-memory store for rate limiting
// In production, use Redis or another distributed store
const ipRequestCounts: Record<string, { count: number; resetTime: number }> = {}

// Rate limit configuration
const MAX_REQUESTS = 5 // Maximum requests per window
const WINDOW_MS = 60 * 1000 // 1 minute window

export function rateLimiter(req: NextRequest) {
  // Get client IP
  const ip = req.ip || "unknown"
  const now = Date.now()

  // Initialize or get current count for this IP
  if (!ipRequestCounts[ip] || ipRequestCounts[ip].resetTime < now) {
    ipRequestCounts[ip] = { count: 0, resetTime: now + WINDOW_MS }
  }

  // Increment count
  ipRequestCounts[ip].count++

  // Check if rate limit exceeded
  if (ipRequestCounts[ip].count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Too many requests, please try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": `${Math.ceil((ipRequestCounts[ip].resetTime - now) / 1000)}`,
        },
      },
    )
  }

  return null // Continue with the request
}

