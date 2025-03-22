"use client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KnowledgebaseArticle as ArticleType } from "@/contexts/knowledgebase-context"
import ReactMarkdown from "react-markdown"

interface KnowledgebaseArticleProps {
  article: ArticleType
}

export function KnowledgebaseArticle({ article }: KnowledgebaseArticleProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/knowledgebase" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="capitalize">{article.category}</span>
            <span className="mx-2">•</span>
            <span>Updated {article.updatedAt.toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
          {article.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-md">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  )
}

