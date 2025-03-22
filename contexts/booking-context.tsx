"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type BookingStatus = "pending" | "approved" | "rejected"

export type Booking = {
  id: string
  name: string
  email: string
  phone: string
  startDate: Date
  endDate: Date
  guests: number
  status: BookingStatus
  createdAt: Date
}

type BookingContextType = {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  getBookingById: (id: string) => Booking | undefined
}

// Sample booking data
const initialBookings: Booking[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 15),
    guests: 2,
    status: "approved",
    createdAt: new Date(2024, 1, 15),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-987-6543",
    startDate: new Date(2025, 2, 20),
    endDate: new Date(2025, 2, 25),
    guests: 4,
    status: "approved",
    createdAt: new Date(2024, 1, 20),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-456-7890",
    startDate: new Date(2025, 3, 5),
    endDate: new Date(2025, 3, 10),
    guests: 3,
    status: "pending",
    createdAt: new Date(2024, 2, 1),
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "555-789-0123",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 3, 20),
    guests: 2,
    status: "pending",
    createdAt: new Date(2024, 2, 5),
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert@example.com",
    phone: "555-234-5678",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 4, 7),
    guests: 5,
    status: "rejected",
    createdAt: new Date(2024, 2, 10),
  },
]

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  const addBooking = (bookingData: Omit<Booking, "id" | "status" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    }

    setBookings((prev) => [...prev, newBooking])
    return newBooking
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)))
  }

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
  }

  const getBookingById = (id: string) => {
    return bookings.find((booking) => booking.id === id)
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingById,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider")
  }
  return context
}

