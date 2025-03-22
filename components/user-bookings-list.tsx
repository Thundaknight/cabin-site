"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Edit, Trash2, Clock, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { BookingManagement } from "@/components/booking-management"
import { useBookings, type Booking, type BookingStatus } from "@/contexts/booking-context"
import { useUser } from "@/contexts/user-context"

export function UserBookingsList() {
  const { bookings, updateBooking, deleteBooking } = useBookings()
  const { user } = useUser()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [managementType, setManagementType] = useState<"cancel" | "change" | "extend" | null>(null)

  // Filter bookings to only show the current user's bookings
  const userBookings = bookings.filter((booking) => booking.email === user?.email)

  const handleCancelBooking = (id: string) => {
    deleteBooking(id)
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled.",
    })
    setDialogOpen(false)
  }

  const handleUpdateBooking = (updatedBooking: Booking) => {
    updateBooking(updatedBooking.id, updatedBooking)
    toast({
      title: "Booking Updated",
      description: "Your booking has been successfully updated.",
    })
    setDialogOpen(false)
  }

  const handleAddToGoogleCalendar = (booking: Booking) => {
    // In a real app, this would integrate with Google Calendar API
    toast({
      title: "Added to Google Calendar",
      description: `Your booking from ${format(booking.startDate, "PPP")} to ${format(booking.endDate, "PPP")} has been added to your Google Calendar.`,
    })
  }

  function BookingStatusBadge({ status }: { status: BookingStatus }) {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </div>
        )
      case "approved":
        return (
          <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {userBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Bookings Found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You don't have any cabin bookings yet. Book your first stay now!
            </p>
            <Button className="mt-4" onClick={() => document.querySelector('[data-value="new"]')?.click()}>
              Book a Stay
            </Button>
          </CardContent>
        </Card>
      ) : (
        userBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{booking.name}</CardTitle>
                  <CardDescription>{booking.email}</CardDescription>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(booking.startDate, "PPP")} - {format(booking.endDate, "PPP")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Guests: {booking.guests}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {booking.status === "approved" && (
                  <Button variant="outline" size="sm" onClick={() => handleAddToGoogleCalendar(booking)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Add to Google Calendar
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {booking.status !== "rejected" && (
                  <Dialog
                    open={dialogOpen && selectedBooking?.id === booking.id}
                    onOpenChange={(open) => {
                      setDialogOpen(open)
                      if (!open) {
                        setSelectedBooking(null)
                        setManagementType(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setManagementType("cancel")
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {managementType === "cancel" && selectedBooking && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Cancel Booking</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel your booking from{" "}
                              {format(selectedBooking.startDate, "PPP")} to {format(selectedBooking.endDate, "PPP")}?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              Keep Booking
                            </Button>
                            <Button variant="destructive" onClick={() => handleCancelBooking(selectedBooking.id)}>
                              Cancel Booking
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                      {(managementType === "change" || managementType === "extend") && selectedBooking && (
                        <BookingManagement
                          booking={selectedBooking}
                          type={managementType}
                          onUpdate={handleUpdateBooking}
                          onCancel={() => setDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {booking.status === "approved" && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setManagementType("change")
                            setDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Change Dates
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setManagementType("extend")
                            setDialogOpen(true)
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Extend Stay
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

