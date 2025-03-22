"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type EmailSettings = {
  enabled: boolean
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

type EmailContextType = {
  settings: EmailSettings
  updateSettings: (settings: EmailSettings) => void
  sendEmail: (to: string, subject: string, body: string) => Promise<boolean>
}

// Default settings
const defaultSettings: EmailSettings = {
  enabled: true,
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "user@example.com",
    pass: "password",
  },
  from: "cabin@example.com",
}

const EmailContext = createContext<EmailContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  sendEmail: async () => true,
})

export function EmailProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EmailSettings>(defaultSettings)

  const updateSettings = (newSettings: EmailSettings) => {
    setSettings(newSettings)
    // In a real app, you would save these settings to a database or config file
    localStorage.setItem("cabin-email-settings", JSON.stringify(newSettings))
  }

  const sendEmail = async (to: string, subject: string, body: string) => {
    // If email is disabled, just return success without sending
    if (!settings.enabled) {
      console.log("Email is disabled. Would have sent:")
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log(`Body: ${body}`)
      return true
    }

    // In a real app, this would send an actual email using the SMTP settings
    console.log(`Sending email to ${to}:`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
    console.log(`Using SMTP settings:`, settings)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return true
  }

  // Load settings from localStorage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("cabin-email-settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  })

  return <EmailContext.Provider value={{ settings, updateSettings, sendEmail }}>{children}</EmailContext.Provider>
}

export function useEmail() {
  const context = useContext(EmailContext)
  return context
}

