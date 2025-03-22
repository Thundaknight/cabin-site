"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

type AdminUser = {
  email: string
  password: string
  name: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addAdmin: (email: string, password: string, name: string) => void
  removeAdmin: (email: string) => void
  updateAdminPassword: (email: string, currentPassword: string, newPassword: string) => Promise<boolean>
}

// Initial admin accounts
const initialAdmins: AdminUser[] = [
  {
    email: "admin@cabin.com",
    password: "admin123",
    name: "Admin User",
  },
  // Add more admin accounts as needed
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdmins)

  // Check for existing session and admin users on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cabin-admin-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const storedAdmins = localStorage.getItem("cabin-admin-users")
    if (storedAdmins) {
      setAdminUsers(JSON.parse(storedAdmins))
    } else {
      // Initialize admin users in localStorage
      localStorage.setItem("cabin-admin-users", JSON.stringify(adminUsers))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Find admin with matching email and password
    const admin = adminUsers.find((admin) => admin.email === email && admin.password === password)

    if (admin) {
      const adminUser = {
        id: `admin-${Date.now()}`,
        name: admin.name,
        email: admin.email,
        role: "admin" as const,
      }

      setUser(adminUser)
      localStorage.setItem("cabin-admin-user", JSON.stringify(adminUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cabin-admin-user")
  }

  const addAdmin = (email: string, password: string, name: string) => {
    // Check if admin already exists
    if (adminUsers.some((admin) => admin.email === email)) {
      throw new Error("Admin with this email already exists")
    }

    const newAdmins = [...adminUsers, { email, password, name }]
    setAdminUsers(newAdmins)
    localStorage.setItem("cabin-admin-users", JSON.stringify(newAdmins))
  }

  const removeAdmin = (email: string) => {
    // Don't remove the last admin
    if (adminUsers.length <= 1) {
      throw new Error("Cannot remove the last admin account")
    }

    const newAdmins = adminUsers.filter((admin) => admin.email !== email)
    setAdminUsers(newAdmins)
    localStorage.setItem("cabin-admin-users", JSON.stringify(newAdmins))

    // If the current user is being removed, log them out
    if (user?.email === email) {
      logout()
    }
  }

  const updateAdminPassword = async (email: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    // Find admin with matching email
    const adminIndex = adminUsers.findIndex((admin) => admin.email === email)

    if (adminIndex === -1) {
      throw new Error("Admin not found")
    }

    // Verify current password
    if (adminUsers[adminIndex].password !== currentPassword) {
      throw new Error("Current password is incorrect")
    }

    // Update password
    const updatedAdmins = [...adminUsers]
    updatedAdmins[adminIndex] = {
      ...updatedAdmins[adminIndex],
      password: newPassword,
    }

    setAdminUsers(updatedAdmins)
    localStorage.setItem("cabin-admin-users", JSON.stringify(updatedAdmins))

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        addAdmin,
        removeAdmin,
        updateAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

