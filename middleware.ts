import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simplified middleware for demo purposes
  // In a real app, you would verify a JWT token or session cookie

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"

  // Allow access to the login page
  if (isLoginPage) {
    return NextResponse.next()
  }

  // For demo purposes, we'll redirect to login for all admin routes
  // In a real app, you would check for a valid session
  if (isAdminRoute) {
    // In a real app, you would verify the auth token here
    // For demo, we'll just redirect to the login page
    // Client-side auth will handle the actual protection
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

