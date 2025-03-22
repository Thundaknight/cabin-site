import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AuthProvider } from "@/contexts/auth-context"
import { UserProvider } from "@/contexts/user-context"
import { BookingProvider } from "@/contexts/booking-context"
import { EmailProvider } from "@/contexts/email-context"
import { KnowledgebaseProvider } from "@/contexts/knowledgebase-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mountain Cabin Retreat",
  description: "Book your stay at our beautiful mountain cabin retreat",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <UserProvider>
              <EmailProvider>
                <BookingProvider>
                  <KnowledgebaseProvider>
                    <div className="relative flex min-h-screen flex-col">
                      <SiteHeader />
                      <div className="flex-1">{children}</div>
                      <SiteFooter />
                    </div>
                    <Toaster />
                  </KnowledgebaseProvider>
                </BookingProvider>
              </EmailProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

