import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth-utils.server"
import { getAdminsFromStorage, saveAdminsToStorage } from "@/lib/auth-utils.client"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Get existing admins
    const admins = getAdminsFromStorage()

    // Check if admin with this email already exists
    if (admins.some((admin) => admin.email === email)) {
      return NextResponse.json({ success: false, message: "Admin with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create new admin
    const newAdmin = {
      id: `admin-${Date.now()}`,
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    }

    // Add to admins list
    const updatedAdmins = [...admins, newAdmin]
    saveAdminsToStorage(updatedAdmins)

    // Return success response (without the password hash)
    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ success: false, message: "An error occurred while creating the admin" }, { status: 500 })
  }
}

