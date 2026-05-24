'use client'

import type React from 'react'
import { Clock, User, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ArticleWrapperProps {
  children: React.ReactNode
  metadata: {
    title: string
    category: string
    tier: string
    author: string
    reviewer?: string
    datePublished: string
    dateUpdated: string
    readTime: number
    description: string
    keywords: string[]
    entities: string[]
    relatedArticles: string[]
  }
}

export default function ArticleWrapper({
  children,
  metadata,
}: ArticleWrapperProps) {
  return (
    <article className="mx-auto max-w-3xl">
      {/* Article Header */}
      <div className="mb-8 border-b border-gray-200 pb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700">
          {metadata.tier} • {metadata.category}
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {metadata.title}
        </h1>

        <p className="mb-6 text-lg text-gray-600">{metadata.description}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{metadata.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{metadata.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Published {new Date(metadata.datePublished).toLocaleDateString()}
            </span>
          </div>
        </div>

        {metadata.reviewer && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <span className="font-medium">Reviewed by:</span> {metadata.reviewer}
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {children}
      </div>

      {/* Related Articles */}
      {metadata.relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Related Articles
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {metadata.relatedArticles.map((slug) => (
              <Link
                key={slug}
                href={`/wiki/${metadata.category}/${slug}`}
                className="rounded-lg border border-gray-200 p-4 hover:border-emerald-500 hover:bg-emerald-50"
              >
                <h4 className="font-semibold text-gray-900">{slug}</h4>
                <p className="mt-2 text-sm text-gray-600">Continue reading →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="flex flex-wrap gap-2">
          {metadata.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
