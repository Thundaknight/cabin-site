"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"

export function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoading && !user) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname || '/')}`)
    }
  }, [user, isLoading, router, pathname, isClient])

  if (!isClient || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Please log in to continue</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

