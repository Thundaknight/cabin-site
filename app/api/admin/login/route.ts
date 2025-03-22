import { type NextRequest, NextResponse } from "next/server"
import { comparePassword, generateToken, setAuthCookieInNextResponse } from "@/lib/auth-utils.server"
import { getAdminsFromStorage } from "@/lib/auth-utils.client"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Get admin from storage
    const admins = getAdminsFromStorage()
    const admin = admins.find((a) => a.email === email)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    })

    // Create the response
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    })

    // Set the cookie in the response and return
    return setAuthCookieInNextResponse(response, token)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

