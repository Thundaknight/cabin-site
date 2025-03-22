import { hashPassword } from "./auth-utils.server"
import { getAdminsFromStorage, saveAdminsToStorage } from "./auth-utils.client"

// Initialize with a default admin if none exists
export async function initializeAdmin() {
  if (typeof window === "undefined") {
    // Server-side initialization
    return
  }

  // Get existing admins
  const admins = getAdminsFromStorage()

  // If no admins exist, create a default one
  if (admins.length === 0) {
    try {
      const passwordHash = await hashPassword("admin123")

      const defaultAdmin = {
        id: `admin-${Date.now()}`,
        name: "Admin User",
        email: "admin@cabin.com",
        passwordHash,
        createdAt: new Date(),
      }

      saveAdminsToStorage([defaultAdmin])

      console.log("Default admin account created")
    } catch (error) {
      console.error("Error creating default admin:", error)
    }
  }
}

