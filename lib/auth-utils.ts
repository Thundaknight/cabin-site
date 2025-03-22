import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// JWT secret key - in production, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const JWT_EXPIRY = "24h" // Token expiry time
const SALT_ROUNDS = 10 // For bcrypt

export type JwtPayload = {
  id: string
  email: string
  role: string
  name: string
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a password with a hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate a JWT token
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Verify a JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}

// Set JWT token in a cookie
export function setAuthCookie(token: string): void {
  cookies().set({
    name: "cabin-auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  })
}

// Get JWT token from cookies
export function getAuthCookie(req: NextRequest): string | undefined {
  const token = req.cookies.get("cabin-auth-token")?.value
  return token
}

// Clear auth cookie
export function clearAuthCookie(): void {
  cookies().delete("cabin-auth-token")
}

