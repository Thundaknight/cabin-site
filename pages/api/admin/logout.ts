import type { NextApiRequest, NextApiResponse } from "next"
import { clearAuthCookieInResponse } from "@/lib/auth-utils.server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    // Clear the auth cookie
    clearAuthCookieInResponse(res)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ success: false, message: "An error occurred during logout" })
  }
}

