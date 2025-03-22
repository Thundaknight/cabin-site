"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample booking data
const initialBookings = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 15),
    guests: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    startDate: new Date(2025, 2, 20),
    endDate: new Date(2025, 2, 25),
    guests: 4,
  },
]

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bookings] = useState(initialBookings)

  // Function to check if a date is booked
  const isDateBooked = (date: Date) => {
    return bookings.some((booking) => date >= booking.startDate && date <= booking.endDate)
  }

  // Function to get booking details for a date
  const getBookingForDate = (date: Date) => {
    return bookings.find((booking) => date >= booking.startDate && date <= booking.endDate)
  }

  // Function to render day contents
  const renderDayContents = (day: Date) => {
    const isBooked = isDateBooked(day)

    return (
      <div className={`w-full h-full ${isBooked ? "bg-red-100" : ""}`}>
        {day.getDate()}
        {isBooked && (
          <div className="absolute bottom-0 left-0 right-0">
            <Badge variant="outline" className="text-xs bg-red-100 border-red-200 text-red-800 w-full rounded-none">
              Booked
            </Badge>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => renderDayContents(date),
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Date</h3>
              {date && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {isDateBooked(date) ? (
                    <div className="mt-4 space-y-2">
                      <Badge variant="outline" className="bg-red-100 border-red-200 text-red-800">
                        Booked
                      </Badge>
                      <p className="text-sm text-muted-foreground">This date is already booked.</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Badge variant="outline" className="bg-green-100 border-green-200 text-green-800">
                        Available
                      </Badge>
                      <div className="mt-4">
                        <Link href="/book">
                          <Button>Book This Date</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center">
        <Link href="/book?tab=existing">
          <Button variant="outline">View All Bookings</Button>
        </Link>
      </div>
    </div>
  )
}

