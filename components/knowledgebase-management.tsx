"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Edit, Trash2, Eye, Plus, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useKnowledgebase, type ArticleCategory } from "@/contexts/knowledgebase-context"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  category: z.enum(["general", "booking", "amenities", "policies", "location", "activities"] as const, {
    required_error: "Please select a category.",
  }),
  published: z.boolean().default(false),
  imageUrl: z.string().optional(),
})

export function KnowledgebaseManagement() {
  const { articles, addArticle, updateArticle, deleteArticle } = useKnowledgebase()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingArticle, setEditingArticle] = useState<string | null>(null)
  const [previewArticle, setPreviewArticle] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | ArticleCategory>("all")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      published: false,
      imageUrl: "",
    },
  })

  const resetForm = () => {
    form.reset({
      title: "",
      content: "",
      category: "general",
      published: false,
      imageUrl: "",
    })
    setEditingArticle(null)
  }

  const handleEditArticle = (id: string) => {
    const article = articles.find((a) => a.id === id)
    if (article) {
      form.reset({
        title: article.title,
        content: article.content,
        category: article.category,
        published: article.published,
        imageUrl: article.imageUrl || "",
      })
      setEditingArticle(id)
      setIsDialogOpen(true)
    }
  }

  const handlePreviewArticle = (id: string) => {
    setPreviewArticle(id)
  }

  const handleDeleteArticle = (id: string) => {
    deleteArticle(id)
    toast({
      title: "Article deleted",
      description: "The article has been deleted successfully.",
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (editingArticle) {
        // Update existing article
        updateArticle(editingArticle, {
          title: values.title,
          content: values.content,
          category: values.category,
          published: values.published,
          imageUrl: values.imageUrl && values.imageUrl.trim() !== "" ? values.imageUrl : undefined,
        })

        toast({
          title: "Article updated",
          description: "The article has been updated successfully.",
        })
      } else {
        // Add new article
        addArticle({
          title: values.title,
          content: values.content,
          category: values.category,
          published: values.published,
          imageUrl: values.imageUrl && values.imageUrl.trim() !== "" ? values.imageUrl : undefined,
        })

        toast({
          title: "Article added",
          description: "The article has been added successfully.",
        })
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the article.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredArticles = activeTab === "all" ? articles : articles.filter((article) => article.category === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Knowledge Base Management</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle
                  ? "Update the article details below."
                  : "Create a new knowledge base article to help users."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="booking">Booking</SelectItem>
                          <SelectItem value="amenities">Amenities</SelectItem>
                          <SelectItem value="policies">Policies</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="activities">Activities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                          {field.value && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => form.setValue("imageUrl", "")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Enter a URL for an image to display at the top of the article</FormDescription>
                      <FormMessage />
                      {field.value && field.value.trim() !== "" && (
                        <div className="mt-2 border rounded-md overflow-hidden">
                          <img
                            src={field.value || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-[200px] object-cover w-full"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (Markdown supported)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your article content here..."
                          className="min-h-[300px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can use Markdown formatting: # for headings, * for lists, ** for bold, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          When enabled, this article will be visible to users in the knowledge base.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingArticle ? "Update Article" : "Add Article"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>Manage knowledge base articles for your users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "all" | ArticleCategory)}
            className="w-full mb-6"
          >
            <TabsList className="grid grid-cols-4 md:grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No articles found. Add an article to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="capitalize">{article.category}</TableCell>
                    <TableCell>
                      {article.published ? (
                        <div className="flex items-center text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          Published
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <X className="mr-1 h-4 w-4" />
                          Draft
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{article.updatedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handlePreviewArticle(article.id)}>
                          <Eye className="h-4 w-4 text-blue-500" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article.id)}>
                          <Edit className="h-4 w-4 text-amber-500" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {previewArticle && (
            <Dialog open={!!previewArticle} onOpenChange={(open) => !open && setPreviewArticle(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Article Preview</DialogTitle>
                </DialogHeader>
                <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                  {(() => {
                    const article = articles.find((a) => a.id === previewArticle)
                    if (!article) return null

                    return (
                      <>
                        <h1>{article.title}</h1>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <span className="capitalize">{article.category}</span>
                          <span className="mx-2">•</span>
                          <span>Updated {article.updatedAt.toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{article.published ? "Published" : "Draft"}</span>
                        </div>
                        {article.imageUrl && (
                          <div className="mb-4 overflow-hidden rounded-md">
                            <img
                              src={article.imageUrl || "/placeholder.svg"}
                              alt={article.title}
                              className="max-h-[300px] object-cover w-full"
                            />
                          </div>
                        )}
                        <div className="markdown-content">
                          {article.content.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </div>
                <DialogFooter>
                  <Button onClick={() => setPreviewArticle(null)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

