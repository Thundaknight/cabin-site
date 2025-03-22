import { BookingCalendar } from "@/components/booking-calendar"
import { Hero } from "@/components/hero"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Check Availability</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                View our current bookings and find the perfect dates for your stay
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-5xl">
            <BookingCalendar />
          </div>
        </div>
      </section>
    </main>
  )
}

