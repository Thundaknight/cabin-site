import type { NextApiRequest, NextApiResponse } from "next"
import { getAdminsFromStorage, saveAdminsToStorage } from "@/lib/auth-utils.client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const { id } = req.body

    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "Admin ID is required" })
    }

    // Get existing admins
    const admins = getAdminsFromStorage()

    // Don't allow deleting the last admin
    if (admins.length <= 1) {
      return res.status(400).json({ success: false, message: "Cannot delete the last admin account" })
    }

    // Remove the admin
    const updatedAdmins = admins.filter((admin) => admin.id !== id)

    // Check if any admins were removed
    if (updatedAdmins.length === admins.length) {
      return res.status(404).json({ success: false, message: "Admin not found" })
    }

    // Save updated admins
    saveAdminsToStorage(updatedAdmins)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Delete admin error:", error)
    return res.status(500).json({ success: false, message: "An error occurred while deleting the admin" })
  }
}

