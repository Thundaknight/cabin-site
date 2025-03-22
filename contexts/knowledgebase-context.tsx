"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ArticleCategory = "general" | "booking" | "amenities" | "policies" | "location" | "activities"

export type KnowledgebaseArticle = {
  id: string
  title: string
  content: string
  category: ArticleCategory
  createdAt: Date
  updatedAt: Date
  published: boolean
  imageUrl?: string
}

type KnowledgebaseContextType = {
  articles: KnowledgebaseArticle[]
  getArticleById: (id: string) => KnowledgebaseArticle | undefined
  getArticlesByCategory: (category: ArticleCategory) => KnowledgebaseArticle[]
  searchArticles: (query: string) => KnowledgebaseArticle[]
  addArticle: (article: Omit<KnowledgebaseArticle, "id" | "createdAt" | "updatedAt">) => KnowledgebaseArticle
  updateArticle: (id: string, updates: Partial<KnowledgebaseArticle>) => void
  deleteArticle: (id: string) => void
}

// Sample articles
const initialArticles: KnowledgebaseArticle[] = [
  {
    id: "1",
    title: "Cabin Booking FAQ",
    content:
      "## Frequently Asked Questions\n\nHere are some common questions about booking our cabin.\n\n### How far in advance should I book?\n\nWe recommend booking at least 3 months in advance for peak seasons (summer and winter holidays).\n\n### What is your cancellation policy?\n\nYou can cancel up to 30 days before your stay for a full refund.",
    category: "booking",
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15),
    published: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    title: "Cabin Amenities",
    content:
      "# Cabin Amenities\n\nOur cabin comes fully equipped with everything you need for a comfortable stay.\n\n## Kitchen\n- Full-size refrigerator\n- Stove and oven\n- Microwave\n- Coffee maker\n- Dishes and utensils\n\n## Entertainment\n- High-speed Wi-Fi\n- Smart TV with streaming services\n- Board games\n\n## Outdoor\n- Hot tub\n- Fire pit\n- BBQ grill",
    category: "amenities",
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 1, 5),
    published: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    title: "Local Hiking Trails",
    content:
      "# Hiking Trails Near the Cabin\n\nThere are several beautiful hiking trails within a short distance of the cabin.\n\n## Mountain View Trail\n- Difficulty: Moderate\n- Length: 3.5 miles\n- Elevation gain: 800 feet\n- Highlights: Panoramic mountain views, wildflowers in spring\n\n## Lakeside Loop\n- Difficulty: Easy\n- Length: 2 miles\n- Elevation gain: 100 feet\n- Highlights: Lake views, bird watching opportunities",
    category: "activities",
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 1, 10),
    published: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
]

const KnowledgebaseContext = createContext<KnowledgebaseContextType | undefined>(undefined)

export function KnowledgebaseProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<KnowledgebaseArticle[]>(initialArticles)

  // Load articles from localStorage on mount
  useEffect(() => {
    const storedArticles = localStorage.getItem("cabin-knowledgebase-articles")
    if (storedArticles) {
      // Convert string dates back to Date objects
      const parsedArticles = JSON.parse(storedArticles, (key, value) => {
        if (key === "createdAt" || key === "updatedAt") {
          return new Date(value)
        }
        return value
      })
      setArticles(parsedArticles)
    } else {
      // Initialize with sample articles
      localStorage.setItem("cabin-knowledgebase-articles", JSON.stringify(initialArticles))
    }
  }, [])

  // Save articles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cabin-knowledgebase-articles", JSON.stringify(articles))
  }, [articles])

  const getArticleById = (id: string) => {
    return articles.find((article) => article.id === id)
  }

  const getArticlesByCategory = (category: ArticleCategory) => {
    return articles.filter((article) => article.category === category && article.published)
  }

  const searchArticles = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        (article.title.toLowerCase().includes(lowerQuery) || article.content.toLowerCase().includes(lowerQuery)) &&
        article.published,
    )
  }

  const addArticle = (articleData: Omit<KnowledgebaseArticle, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date()
    const newArticle: KnowledgebaseArticle = {
      ...articleData,
      id: `article-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    setArticles((prev) => [...prev, newArticle])
    return newArticle
  }

  const updateArticle = (id: string, updates: Partial<KnowledgebaseArticle>) => {
    setArticles((prev) =>
      prev.map((article) => (article.id === id ? { ...article, ...updates, updatedAt: new Date() } : article)),
    )
  }

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id))
  }

  return (
    <KnowledgebaseContext.Provider
      value={{
        articles,
        getArticleById,
        getArticlesByCategory,
        searchArticles,
        addArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </KnowledgebaseContext.Provider>
  )
}

export function useKnowledgebase() {
  const context = useContext(KnowledgebaseContext)
  if (context === undefined) {
    throw new Error("useKnowledgebase must be used within a KnowledgebaseProvider")
  }
  return context
}

