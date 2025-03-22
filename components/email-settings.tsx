"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useEmail, type EmailSettings as EmailSettingsType } from "@/contexts/email-context"

const formSchema = z.object({
  enabled: z.boolean().default(true),
  host: z.string().min(1, {
    message: "SMTP host is required.",
  }),
  port: z.coerce.number().int().positive({
    message: "Port must be a positive integer.",
  }),
  secure: z.boolean().default(false),
  authUser: z.string().min(1, {
    message: "Username is required.",
  }),
  authPass: z.string().min(1, {
    message: "Password is required.",
  }),
  from: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function EmailSettings() {
  const { settings, updateSettings, sendEmail } = useEmail()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: settings.enabled,
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      authUser: settings.auth.user,
      authPass: settings.auth.pass,
      from: settings.from,
    },
  })

  // Watch the enabled field to conditionally disable other fields
  const emailEnabled = form.watch("enabled")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const newSettings: EmailSettingsType = {
        enabled: values.enabled,
        host: values.host,
        port: values.port,
        secure: values.secure,
        auth: {
          user: values.authUser,
          pass: values.authPass,
        },
        from: values.from,
      }

      updateSettings(newSettings)

      toast({
        title: "Settings saved",
        description: "Email settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTestEmail = async () => {
    if (!emailEnabled) {
      toast({
        title: "Email is disabled",
        description: "Enable email notifications to send test emails.",
        variant: "destructive",
      })
      return
    }

    try {
      await sendEmail(
        form.getValues().from,
        "Test Email from Mountain Cabin Retreat",
        "This is a test email to verify your SMTP settings are working correctly.",
      )

      toast({
        title: "Test email sent",
        description: "A test email has been sent to your address.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please check your settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Email Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure email notifications for bookings and system messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Email Notifications</FormLabel>
                      <FormDescription>
                        When disabled, no emails will be sent to users or administrators.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className={`space-y-6 ${!emailEnabled ? "opacity-50" : ""}`}>
                <h3 className="text-lg font-medium">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input placeholder="smtp.example.com" {...field} disabled={!emailEnabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="587" {...field} disabled={!emailEnabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="secure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use Secure Connection (SSL/TLS)</FormLabel>
                        <FormDescription>Enable if your SMTP server requires a secure connection.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!emailEnabled} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="authUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} disabled={!emailEnabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="authPass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} disabled={!emailEnabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="cabin@example.com" {...field} disabled={!emailEnabled} />
                      </FormControl>
                      <FormDescription>
                        This email address will be used as the sender for all notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleTestEmail} disabled={!emailEnabled}>
                  Send Test Email
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

