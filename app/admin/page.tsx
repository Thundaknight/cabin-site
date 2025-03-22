"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}

