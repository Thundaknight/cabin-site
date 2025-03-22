import type { NextApiRequest, NextApiResponse } from "next"
import { verifyToken, getAuthCookieFromRequest } from "@/lib/auth-utils.server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    // Get token from cookie
    const token = getAuthCookieFromRequest(req)

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return res.status(401).json({ success: false, message: "Invalid token" })
    }

    // Return user info
    return res.status(200).json({
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
    return res.status(500).json({ success: false, message: "An error occurred" })
  }
}

