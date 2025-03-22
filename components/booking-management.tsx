"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface BookingManagementProps {
  booking: {
    id: string
    name: string
    email: string
    startDate: Date
    endDate: Date
    guests: number
  }
  type: "change" | "extend"
  onUpdate: (booking: any) => void
  onCancel: () => void
}

export function BookingManagement({ booking, type, onUpdate, onCancel }: BookingManagementProps) {
  const [startDate, setStartDate] = useState<Date>(booking.startDate)
  const [endDate, setEndDate] = useState<Date>(booking.endDate)

  const handleUpdate = () => {
    onUpdate({
      ...booking,
      startDate,
      endDate,
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{type === "change" ? "Change Booking Dates" : "Extend Your Stay"}</DialogTitle>
        <DialogDescription>
          {type === "change" ? "Select new dates for your cabin stay." : "Select a new end date to extend your stay."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {type === "change" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="check-in" className="text-sm font-medium">
                Check-in Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-in"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date || new Date())
                      // If new start date is after current end date, adjust end date
                      if (date && date > endDate) {
                        setEndDate(addDays(date, 1))
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="check-out" className="text-sm font-medium">
                Check-out Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-out"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date || new Date())}
                    disabled={(date) => date <= startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        {type === "extend" && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Current stay: {format(booking.startDate, "PPP")} - {format(booking.endDate, "PPP")}
              </span>
            </div>
            <label htmlFor="new-check-out" className="text-sm font-medium mt-4">
              New Check-out Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="new-check-out"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setEndDate(date || new Date())}
                  disabled={(date) => date <= booking.endDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>{type === "change" ? "Update Booking" : "Extend Stay"}</Button>
      </DialogFooter>
    </>
  )
}

