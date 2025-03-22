"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useUser } from "@/contexts/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Book } from "lucide-react"

export function SiteHeader() {
  const { user: adminUser } = useAuth()
  const { user, logout } = useUser()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M8 3v4l-2 2"></path>
            <path d="M6 9v4l2 2"></path>
            <path d="M8 15v4l-2 2"></path>
            <path d="M18 3v4l2 2"></path>
            <path d="M20 9v4l-2 2"></path>
            <path d="M18 15v4l2 2"></path>
            <path d="M12 2v20"></path>
          </svg>
          <span className="font-bold">Mountain Cabin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/book" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Book
          </Link>
          <Link
            href="/knowledgebase"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Knowledge Base
          </Link>
          {isMounted && adminUser?.role === "admin" ? (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Admin
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Admin Login
            </Link>
          )}
        </nav>
        <div className="ml-4 flex items-center gap-2">
          {isMounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/book?tab=existing" className="flex w-full">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/knowledgebase" className="flex w-full items-center">
                    <Book className="mr-2 h-4 w-4" />
                    Knowledge Base
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button asChild className="hidden sm:flex">
            <Link href="/book">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

