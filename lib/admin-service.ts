import { hashPassword } from "./auth-utils"

// Admin type definition
export type Admin = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

// In a real app, this would be stored in a database
// For this example, we'll use localStorage on the client and memory on the server
let admins: Admin[] = []

// Initialize with a default admin if none exists
export async function initializeAdmins() {
  if (typeof window !== "undefined") {
    // Client-side
    const storedAdmins = localStorage.getItem("cabin-admins")
    if (storedAdmins) {
      admins = JSON.parse(storedAdmins)
    } else {
      // Create default admin if no admins exist
      const defaultAdmin = await createAdmin("Admin User", "admin@cabin.com", "admin123")
      admins = [defaultAdmin]
      localStorage.setItem("cabin-admins", JSON.stringify(admins))
    }
  } else {
    // Server-side - in a real app, you'd query your database
    if (admins.length === 0) {
      const defaultAdmin = await createAdmin("Admin User", "admin@cabin.com", "admin123")
      admins = [defaultAdmin]
    }
  }

  return admins
}

// Get all admins
export function getAllAdmins(): Admin[] {
  if (typeof window !== "undefined") {
    const storedAdmins = localStorage.getItem("cabin-admins")
    return storedAdmins ? JSON.parse(storedAdmins) : []
  }
  return admins
}

// Get admin by email
export function getAdminByEmail(email: string): Admin | undefined {
  const allAdmins = getAllAdmins()
  return allAdmins.find((admin) => admin.email === email)
}

// Create a new admin
export async function createAdmin(name: string, email: string, password: string): Promise<Admin> {
  // Check if admin with this email already exists
  const existingAdmin = getAdminByEmail(email)
  if (existingAdmin) {
    throw new Error("Admin with this email already exists")
  }

  // Hash the password
  const passwordHash = await hashPassword(password)

  // Create new admin
  const newAdmin: Admin = {
    id: `admin-${Date.now()}`,
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  }

  // Add to admins list
  const allAdmins = getAllAdmins()
  const updatedAdmins = [...allAdmins, newAdmin]

  // Save to storage
  if (typeof window !== "undefined") {
    localStorage.setItem("cabin-admins", JSON.stringify(updatedAdmins))
  } else {
    admins = updatedAdmins
  }

  return newAdmin
}

// Delete an admin
export function deleteAdmin(id: string): boolean {
  const allAdmins = getAllAdmins()

  // Don't allow deleting the last admin
  if (allAdmins.length <= 1) {
    throw new Error("Cannot delete the last admin account")
  }

  const updatedAdmins = allAdmins.filter((admin) => admin.id !== id)

  // Save to storage
  if (typeof window !== "undefined") {
    localStorage.setItem("cabin-admins", JSON.stringify(updatedAdmins))
  } else {
    admins = updatedAdmins
  }

  return true
}

