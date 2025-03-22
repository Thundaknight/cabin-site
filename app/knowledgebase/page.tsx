"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKnowledgebase, type ArticleCategory } from "@/contexts/knowledgebase-context"
import { UserProtectedRoute } from "@/components/user-protected-route"

export default function KnowledgebasePage() {
  const { articles, searchArticles, getArticlesByCategory } = useKnowledgebase()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ArticleCategory | "all">("all")
  const [filteredArticles, setFilteredArticles] = useState(articles.filter((a) => a.published))
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Set the active tab based on the URL parameter
    const category = searchParams?.get("category") as ArticleCategory | "all" | null
    if (category) {
      setActiveTab(category)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery) {
      setFilteredArticles(searchArticles(searchQuery))
    } else if (activeTab === "all") {
      setFilteredArticles(articles.filter((a) => a.published))
    } else {
      setFilteredArticles(getArticlesByCategory(activeTab as ArticleCategory))
    }
  }, [searchQuery, activeTab, articles, searchArticles, getArticlesByCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      setFilteredArticles(searchArticles(searchQuery))
    }
  }

  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Knowledge Base</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <UserProtectedRoute>
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Knowledge Base</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our cabin and services
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <div className="mb-8">
                <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search articles..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="ml-2">
                    Search
                  </Button>
                </form>
              </div>

              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as ArticleCategory | "all")}
                className="w-full"
              >
                <div className="flex items-center mb-4">
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                <TabsList className="grid grid-cols-3 md:grid-cols-7">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="booking">Booking</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <Link key={article.id} href={`/knowledgebase/${article.id}`}>
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardHeader className="pb-2">
                              <CardTitle>{article.title}</CardTitle>
                              <CardDescription>
                                Category: {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {article.imageUrl && (
                                <div className="mb-4 overflow-hidden rounded-md">
                                  <img
                                    src={article.imageUrl || "/placeholder.svg"}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                  />
                                </div>
                              )}
                              <p className="line-clamp-2 text-muted-foreground">
                                {article.content.replace(/[#*_]/g, "").substring(0, 150)}...
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium">No articles found</h3>
                        <p className="text-muted-foreground mt-2">
                          {searchQuery ? `No results for "${searchQuery}"` : "No articles in this category yet"}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {["general", "booking", "amenities", "policies", "location", "activities"].map((category) => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid gap-6">
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <Link key={article.id} href={`/knowledgebase/${article.id}`}>
                            <Card className="hover:bg-muted/50 transition-colors">
                              <CardHeader className="pb-2">
                                <CardTitle>{article.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {article.imageUrl && (
                                  <div className="mb-4 overflow-hidden rounded-md">
                                    <img
                                      src={article.imageUrl || "/placeholder.svg"}
                                      alt={article.title}
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                )}
                                <p className="line-clamp-2 text-muted-foreground">
                                  {article.content.replace(/[#*_]/g, "").substring(0, 150)}...
                                </p>
                              </CardContent>
                            </Card>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium">No articles found</h3>
                          <p className="text-muted-foreground mt-2">
                            {searchQuery ? `No results for "${searchQuery}"` : "No articles in this category yet"}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </UserProtectedRoute>
  )
}

