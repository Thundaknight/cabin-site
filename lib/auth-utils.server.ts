import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { serialize, parse } from "cookie"
import type { NextApiResponse, NextApiRequest } from "next"
import type { NextRequest, NextResponse } from "next/server"

// JWT secret key - in production, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const JWT_EXPIRY = "24h" // Token expiry time
const SALT_ROUNDS = 10 // For bcrypt
const COOKIE_NAME = "cabin-auth-token"

export type JwtPayload = {
  id: string
  email: string
  role: string
  name: string
}

// Hash a password - server side only
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a password with a hash - server side only
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate a JWT token - server side only
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Verify a JWT token - server side only
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}

// Set JWT token in a cookie - for Pages API routes
export function setAuthCookieInResponse(res: NextApiResponse, token: string): void {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  })

  res.setHeader("Set-Cookie", cookie)
}

// Set JWT token in a cookie - for App Router API routes
export function setAuthCookieInNextResponse<T>(response: NextResponse<T>, token: string): NextResponse<T> {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  })

  return response
}

// Get JWT token from cookies - for Pages API routes
export function getAuthCookieFromRequest(req: NextApiRequest): string | undefined {
  const cookies = parse(req.headers.cookie || "")
  return cookies[COOKIE_NAME]
}

// Get JWT token from cookies - for App Router API routes or middleware
export function getAuthCookieFromNextRequest(req: NextRequest): string | undefined {
  return req.cookies.get(COOKIE_NAME)?.value
}

// Clear auth cookie - for Pages API routes
export function clearAuthCookieInResponse(res: NextApiResponse): void {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  res.setHeader("Set-Cookie", cookie)
}

// Clear auth cookie - for App Router API routes
export function clearAuthCookieInNextResponse<T>(response: NextResponse<T>): NextResponse<T> {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return response
}

