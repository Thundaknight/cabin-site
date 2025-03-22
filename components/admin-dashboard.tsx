"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, XCircle, Clock, LogOut, Users, Mail, User, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useBookings, type Booking, type BookingStatus } from "@/contexts/booking-context"
import { BookingDetailsDialog } from "@/components/booking-details-dialog"
import { UserManagement } from "@/components/user-management"
import { EmailSettings } from "@/components/email-settings"
import { useEmail } from "@/contexts/email-context"
import { AdminManagement } from "@/components/admin-management"
import { KnowledgebaseManagement } from "@/components/knowledgebase-management"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { bookings, updateBooking } = useBookings()
  const { sendEmail, settings: emailSettings } = useEmail()
  const { toast } = useToast()
  const router = useRouter()

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const pendingBookings = bookings.filter((booking) => booking.status === "pending")
  const approvedBookings = bookings.filter((booking) => booking.status === "approved")
  const rejectedBookings = bookings.filter((booking) => booking.status === "rejected")

  const handleLogout = () => {
    logout()
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const handleApproveBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    updateBooking(id, { status: "approved" })

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
  }

  const handleRejectBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    updateBooking(id, { status: "rejected" })

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
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.name}</CardTitle>
            <CardDescription>{booking.email}</CardDescription>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(booking.startDate, "PPP")} - {format(booking.endDate, "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Guests: {booking.guests}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
          View Details
        </Button>
        <div className="flex gap-2">
          {booking.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleApproveBooking(booking.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleRejectBooking(booking.id)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  if (!isMounted) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage cabin bookings, users, and system settings</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedBookings.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedBookings.length})</TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="admins">
            <User className="mr-2 h-4 w-4" />
            Admins
          </TabsTrigger>
          <TabsTrigger value="knowledgebase">
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No pending booking requests</p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No approved bookings</p>
              </CardContent>
            </Card>
          ) : (
            approvedBookings.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No rejected bookings</p>
              </CardContent>
            </Card>
          ) : (
            rejectedBookings.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="admins" className="mt-6">
          <AdminManagement />
        </TabsContent>

        <TabsContent value="knowledgebase" className="mt-6">
          <KnowledgebaseManagement />
        </TabsContent>
      </Tabs>

      {selectedBooking && (
        <BookingDetailsDialog booking={selectedBooking} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </div>
  )
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

