export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Cabin Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need for a comfortable and memorable stay
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M3 7V5c0-1.1.9-2 2-2h2"></path>
              <path d="M17 3h2c1.1 0 2 .9 2 2v2"></path>
              <path d="M21 17v2c0 1.1-.9 2-2 2h-2"></path>
              <path d="M7 21H5c-1.1 0-2-.9-2-2v-2"></path>
              <rect width="7" height="5" x="7" y="7" rx="1"></rect>
              <rect width="7" height="5" x="10" y="12" rx="1"></rect>
            </svg>
            <h3 className="text-xl font-bold">3 Bedrooms</h3>
            <p className="text-sm text-muted-foreground">Comfortable sleeping arrangements for up to 6 guests</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 4 0V4a1 1 0 0 0-1-1Z"></path>
              <path d="M19 9h-5a2 2 0 0 0-2 2v3a2 2 0 0 0 4 0v-2h3a2 2 0 0 0 0-4Z"></path>
              <path d="M12 12v3a2 2 0 0 0 2 2h3"></path>
              <path d="M5 15v1a2 2 0 0 0 2 2h3"></path>
              <path d="M19 15v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h9"></path>
            </svg>
            <h3 className="text-xl font-bold">Full Kitchen</h3>
            <p className="text-sm text-muted-foreground">Modern appliances and everything you need to prepare meals</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M15 22v-4"></path>
              <path d="M7 22v-4"></path>
              <path d="M11 22v-4"></path>
              <path d="M17 8v.8A4 4 0 0 1 16 17a4 4 0 0 1-4 1.8"></path>
              <path d="M5 8v.8a4 4 0 0 0 1 8.2c1.3.2 2.6 0 3.6-.7"></path>
              <path d="M5 8v-.7C5 5 7 3 9.2 3c.9 0 1.8.3 2.6.9"></path>
              <path d="M17 8v-.7c0-2.3-2-4.3-4.2-4.3-.3 0-.6 0-.8.1"></path>
              <path d="M13 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
            </svg>
            <h3 className="text-xl font-bold">Hot Tub</h3>
            <p className="text-sm text-muted-foreground">Relax under the stars in our private outdoor hot tub</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M6 7c0-4 4.33-5 6-5 3 0 6 2 6 5 0 2.67-2 5-6 5-2 0-4 0-4 2v8"></path>
              <circle cx="6" cy="20" r="2"></circle>
            </svg>
            <h3 className="text-xl font-bold">Wi-Fi</h3>
            <p className="text-sm text-muted-foreground">Stay connected with high-speed internet access</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
              <circle cx="12" cy="8" r="2"></circle>
            </svg>
            <h3 className="text-xl font-bold">Hiking Trails</h3>
            <p className="text-sm text-muted-foreground">Direct access to scenic hiking trails from the property</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
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
              className="h-10 w-10 text-primary"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
              <path d="M12 11v6"></path>
              <path d="M8 11v6"></path>
              <path d="M16 11v6"></path>
            </svg>
            <h3 className="text-xl font-bold">Fireplace</h3>
            <p className="text-sm text-muted-foreground">Cozy wood-burning fireplace for chilly evenings</p>
          </div>
        </div>
      </div>
    </section>
  )
}

