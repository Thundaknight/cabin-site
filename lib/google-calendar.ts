export interface CalendarEvent {
  summary: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
}

export async function addToGoogleCalendar(event: CalendarEvent): Promise<boolean> {
  // In a real implementation, this would:
  // 1. Check if the user is authenticated with Google
  // 2. If not, redirect to Google OAuth flow
  // 3. Use the Google Calendar API to create an event

  console.log("Adding event to Google Calendar:", event)

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return true
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  // Create a Google Calendar URL that users can click to add the event to their calendar
  const startDate = event.startDateTime.toISOString().replace(/-|:|\.\d+/g, "")
  const endDate = event.endDateTime.toISOString().replace(/-|:|\.\d+/g, "")

  const url = new URL("https://calendar.google.com/calendar/render")
  url.searchParams.append("action", "TEMPLATE")
  url.searchParams.append("text", event.summary)
  url.searchParams.append("dates", `${startDate}/${endDate}`)
  url.searchParams.append("details", event.description)
  url.searchParams.append("location", event.location)

  return url.toString()
}

