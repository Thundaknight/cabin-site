import { NextResponse } from "next/server"
import { clearAuthCookieInNextResponse } from "@/lib/auth-utils.server"

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true })

    // Clear the auth cookie and return
    return clearAuthCookieInNextResponse(response)
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during logout" }, { status: 500 })
  }
}

