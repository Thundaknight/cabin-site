"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type User = {
  id: string
  name: string
  email: string
  role: "user"
}

type UserContextType = {
  user: User | null
  users: User[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addUser: (name: string, email: string, password: string) => Promise<User>
  updateUser: (id: string, updates: { name?: string; email?: string; password?: string }) => Promise<void>
  deleteUser: (id: string) => void
}

// Sample users data
const initialUsers: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john@example.com",
    role: "user",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
  },
]

// Simple in-memory password storage (in a real app, this would be hashed and stored in a database)
const userPasswords: Record<string, string> = {
  "john@example.com": "password123",
  "sarah@example.com": "password123",
}

const UserContext = createContext<UserContextType>({
  user: null,
  users: [],
  isLoading: true,
  login: async () => false,
  logout: () => {},
  addUser: async () => ({ id: "", name: "", email: "", role: "user" }),
  updateUser: async () => {},
  deleteUser: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cabin-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // In a real app, this would be an API call to your backend
    const matchedUser = users.find((u) => u.email === email)

    if (matchedUser && userPasswords[email] === password) {
      setUser(matchedUser)
      localStorage.setItem("cabin-user", JSON.stringify(matchedUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cabin-user")
  }

  const addUser = async (name: string, email: string, password: string) => {
    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already exists")
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
    }

    // Add user to the list
    setUsers((prev) => [...prev, newUser])

    // Store password (in a real app, this would be hashed)
    userPasswords[email] = password

    return newUser
  }

  const updateUser = async (id: string, updates: { name?: string; email?: string; password?: string }) => {
    const userToUpdate = users.find((u) => u.id === id)
    if (!userToUpdate) {
      throw new Error("User not found")
    }

    // Check if email is being changed and if it already exists
    if (updates.email && updates.email !== userToUpdate.email && users.some((u) => u.email === updates.email)) {
      throw new Error("Email already exists")
    }

    // Update user
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          name: updates.name || u.name,
          email: updates.email || u.email,
        }
      }
      return u
    })

    setUsers(updatedUsers)

    // Update password if provided
    if (updates.password) {
      const oldEmail = userToUpdate.email
      const newEmail = updates.email || oldEmail

      // Remove old password entry if email changed
      if (oldEmail !== newEmail) {
        delete userPasswords[oldEmail]
      }

      // Set new password
      userPasswords[newEmail] = updates.password
    }

    // If the updated user is the current user, update the session
    if (user?.id === id) {
      const updatedUser = updatedUsers.find((u) => u.id === id)
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("cabin-user", JSON.stringify(updatedUser))
      }
    }
  }

  const deleteUser = (id: string) => {
    const userToDelete = users.find((u) => u.id === id)
    if (userToDelete) {
      // Remove password
      delete userPasswords[userToDelete.email]

      // Remove user from list
      setUsers((prev) => prev.filter((u) => u.id !== id))

      // If the deleted user is the current user, log them out
      if (user?.id === id) {
        logout()
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        isLoading,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  return context
}

