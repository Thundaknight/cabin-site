import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Escape to Nature</h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Experience tranquility in our beautiful cabin retreat. Book your stay today and reconnect with nature.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/book">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Book Now
                </Button>
              </Link>
              <Link href="/book?tab=existing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Bookings
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Cabin exterior"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              src="/placeholder.svg?height=550&width=800"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

