"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { KnowledgebaseArticle } from "@/components/knowledgebase-article"
import { useKnowledgebase } from "@/contexts/knowledgebase-context"
import { UserProtectedRoute } from "@/components/user-protected-route"

export default function ArticlePage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { getArticleById } = useKnowledgebase()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id as string)
      if (foundArticle && foundArticle.published) {
        setArticle(foundArticle)
      } else {
        // Article not found or not published, redirect to knowledgebase
        router.push("/knowledgebase")
      }
    }
    setIsLoading(false)
  }, [id, getArticleById, router])

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!article) {
    return null // Router will redirect
  }

  return (
    <UserProtectedRoute>
      <main className="flex min-h-screen flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <KnowledgebaseArticle article={article} />
            </div>
          </div>
        </section>
      </main>
    </UserProtectedRoute>
  )
}

