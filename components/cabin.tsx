export function Cabin() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Cabin</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A peaceful retreat nestled in the heart of nature
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M2 22v-5l5-5 5 5-5 5z"></path>
                    <path d="M9.5 14.5 16 8"></path>
                    <path d="m17 2 5 5-5 5-5-5z"></path>
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Fully Equipped</h3>
                  <p className="text-muted-foreground">
                    Modern kitchen, comfortable bedrooms, and all the amenities you need for a relaxing stay.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Private & Secure</h3>
                  <p className="text-muted-foreground">
                    Secluded location with security features for your peace of mind.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
                    <circle cx="12" cy="8" r="2"></circle>
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Perfect Location</h3>
                  <p className="text-muted-foreground">Close to hiking trails, lakes, and other natural attractions.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <img
                alt="Cabin interior"
                className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                src="/placeholder.svg?height=400&width=400"
              />
              <img
                alt="Cabin bedroom"
                className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                src="/placeholder.svg?height=400&width=400"
              />
              <img
                alt="Cabin kitchen"
                className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                src="/placeholder.svg?height=400&width=400"
              />
              <img
                alt="Cabin view"
                className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                src="/placeholder.svg?height=400&width=400"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

