"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { UserProtectedRoute } from "@/components/user-protected-route"
import { UserBookingsList } from "@/components/user-bookings-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookPage() {
  const [isMounted, setIsMounted] = useState(false)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("new")

  useEffect(() => {
    setIsMounted(true)

    // Set the active tab based on the URL parameter
    if (searchParams?.get("tab") === "existing") {
      setActiveTab("existing")
    }
  }, [searchParams])

  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Book Your Stay</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <UserProtectedRoute>
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Cabin Bookings</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Book your stay or manage your existing reservations
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="new" data-value="new">
                    New Booking
                  </TabsTrigger>
                  <TabsTrigger value="existing" data-value="existing">
                    Your Bookings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="new" className="mt-6">
                  <div className="mx-auto max-w-md">
                    <BookingForm />
                  </div>
                </TabsContent>
                <TabsContent value="existing" className="mt-6">
                  <UserBookingsList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </UserProtectedRoute>
  )
}

