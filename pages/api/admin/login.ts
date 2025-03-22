import type { NextApiRequest, NextApiResponse } from "next"
import { comparePassword, generateToken, setAuthCookieInResponse } from "@/lib/auth-utils.server"
import { getAdminsFromStorage } from "@/lib/auth-utils.client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    // Get admin from storage
    const admins = getAdminsFromStorage()
    const admin = admins.find((a) => a.email === email)

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.passwordHash)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    })

    // Set token in HTTP-only cookie
    setAuthCookieInResponse(res, token)

    // Return success response (without the token in the body for security)
    return res.status(200).json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, message: "An error occurred during login" })
  }
}

