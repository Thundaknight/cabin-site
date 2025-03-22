import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getAuthCookieFromNextRequest } from "@/lib/auth-utils.server"

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = getAuthCookieFromNextRequest(req)

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Return user info
    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}

