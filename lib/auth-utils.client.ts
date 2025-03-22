export type Admin = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

// Safe admin type (no sensitive data)
export type SafeAdmin = {
  id: string
  name: string
  email: string
}

// Get all admins from localStorage
export function getAdminsFromStorage(): Admin[] {
  if (typeof window === "undefined") return []

  const storedAdmins = localStorage.getItem("cabin-admins")
  return storedAdmins ? JSON.parse(storedAdmins) : []
}

// Save admins to localStorage
export function saveAdminsToStorage(admins: Admin[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("cabin-admins", JSON.stringify(admins))
}

// Get safe admin list (no password hashes)
export function getSafeAdmins(): SafeAdmin[] {
  const admins = getAdminsFromStorage()
  return admins.map(({ id, name, email }) => ({ id, name, email }))
}

