import { type NextRequest, NextResponse } from "next/server"
import { getAdminsFromStorage, saveAdminsToStorage } from "@/lib/auth-utils.client"

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()

    // Validate input
    if (!id) {
      return NextResponse.json({ success: false, message: "Admin ID is required" }, { status: 400 })
    }

    // Get existing admins
    const admins = getAdminsFromStorage()

    // Don't allow deleting the last admin
    if (admins.length <= 1) {
      return NextResponse.json({ success: false, message: "Cannot delete the last admin account" }, { status: 400 })
    }

    // Remove the admin
    const updatedAdmins = admins.filter((admin) => admin.id !== id)

    // Check if any admins were removed
    if (updatedAdmins.length === admins.length) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 })
    }

    // Save updated admins
    saveAdminsToStorage(updatedAdmins)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete admin error:", error)
    return NextResponse.json({ success: false, message: "An error occurred while deleting the admin" }, { status: 500 })
  }
}

