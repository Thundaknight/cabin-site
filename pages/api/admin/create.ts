import type { NextApiRequest, NextApiResponse } from "next"
import { hashPassword } from "@/lib/auth-utils.server"
import { getAdminsFromStorage, saveAdminsToStorage } from "@/lib/auth-utils.client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" })
    }

    // Get existing admins
    const admins = getAdminsFromStorage()

    // Check if admin with this email already exists
    if (admins.some((admin) => admin.email === email)) {
      return res.status(400).json({ success: false, message: "Admin with this email already exists" })
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
    return res.status(200).json({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return res.status(500).json({ success: false, message: "An error occurred while creating the admin" })
  }
}

