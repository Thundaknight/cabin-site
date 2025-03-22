"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { type Booking, useBookings } from "@/contexts/booking-context"
import { useEmail } from "@/contexts/email-context"

interface BookingDetailsDialogProps {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  const { updateBooking } = useBookings()
  const { sendEmail, settings: emailSettings } = useEmail()
  const { toast } = useToast()

  const [startDate, setStartDate] = useState<Date>(booking.startDate)
  const [endDate, setEndDate] = useState<Date>(booking.endDate)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveChanges = async () => {
    updateBooking(booking.id, {
      startDate,
      endDate,
    })

    // Send email notification about date change if email is enabled
    if (emailSettings.enabled) {
      await sendEmail(
        booking.email,
        "Booking Dates Updated",
        `Dear ${booking.name},

Your booking dates at Mountain Cabin Retreat have been updated.

New booking details:
- Check-in: ${format(startDate, "PPP")}
- Check-out: ${format(endDate, "PPP")}
- Guests: ${booking.guests}

If you have any questions, please contact us.

Best regards,
Mountain Cabin Retreat Team`,
      )
    }

    toast({
      title: "Booking updated",
      description: emailSettings.enabled
        ? "The booking dates have been updated and the guest has been notified."
        : "The booking dates have been updated. Email notifications are disabled.",
    })

    setIsEditing(false)
  }

  const handleApprove = async () => {
    updateBooking(booking.id, { status: "approved" })

    // Send approval email if email is enabled
    if (emailSettings.enabled) {
      await sendEmail(
        booking.email,
        "Booking Approved",
        `Dear ${booking.name},

Great news! Your booking request at Mountain Cabin Retreat has been approved.

Your booking details:
- Check-in: ${format(booking.startDate, "PPP")}
- Check-out: ${format(booking.endDate, "PPP")}
- Guests: ${booking.guests}

We look forward to welcoming you to our cabin.

Best regards,
Mountain Cabin Retreat Team`,
      )
    }

    toast({
      title: "Booking approved",
      description: emailSettings.enabled
        ? "The booking has been approved and the guest has been notified."
        : "The booking has been approved. Email notifications are disabled.",
    })

    onOpenChange(false)
  }

  const handleReject = async () => {
    updateBooking(booking.id, { status: "rejected" })

    // Send rejection email if email is enabled
    if (emailSettings.enabled) {
      await sendEmail(
        booking.email,
        "Booking Request Update",
        `Dear ${booking.name},

We regret to inform you that we are unable to accommodate your booking request at Mountain Cabin Retreat for the dates you requested.

Your requested booking details:
- Check-in: ${format(booking.startDate, "PPP")}
- Check-out: ${format(booking.endDate, "PPP")}
- Guests: ${booking.guests}

Please feel free to submit another booking request for different dates.

Best regards,
Mountain Cabin Retreat Team`,
      )
    }

    toast({
      title: "Booking rejected",
      description: emailSettings.enabled
        ? "The booking has been rejected and the guest has been notified."
        : "The booking has been rejected. Email notifications are disabled.",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>View and manage booking information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Name:</div>
            <div className="col-span-3">{booking.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Email:</div>
            <div className="col-span-3">{booking.email}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Guests:</div>
            <div className="col-span-3">{booking.guests}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Status:</div>
            <div className="col-span-3">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  booking.status === "pending" && "bg-yellow-100 text-yellow-800",
                  booking.status === "approved" && "bg-green-100 text-green-800",
                  booking.status === "rejected" && "bg-red-100 text-red-800",
                )}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Created:</div>
            <div className="col-span-3">{format(booking.createdAt, "PPP")}</div>
          </div>

          {isEditing ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Check-in:</div>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Check-out:</div>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Dates:</div>
              <div className="col-span-3">
                {format(booking.startDate, "PPP")} - {format(booking.endDate, "PPP")}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Change Dates
              </Button>
              <div className="flex gap-2">
                {booking.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="default" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

