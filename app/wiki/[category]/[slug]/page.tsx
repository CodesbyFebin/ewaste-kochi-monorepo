import WikiLayout from '@/components/wiki/wiki-layout'
import ArticleWrapper from '@/components/wiki/article-wrapper'
import { getArticle, getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

export async function generateStaticParams() {
  const categories = [
    'recycling',
    'compliance',
    'itad',
    'data-destruction',
    'esg',
    'materials',
    'localities',
  ]
  const params: any[] = []

  for (const category of categories) {
    const articles = await getAllArticlesInCategory(category)
    articles.forEach((article) => {
      params.push({
        category,
        slug: article.slug,
      })
    })
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const article = await getArticle(params.category, params.slug)
  if (!article) {
    notFound()
  }

  return {
    title: `${article.metadata.title} - Wiki`,
    description: article.metadata.description,
    keywords: article.metadata.keywords,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: 'article',
      publishedTime: article.metadata.datePublished,
      modifiedTime: article.metadata.dateUpdated,
    },
  }
}

// MDX Component overrides
const mdxComponents = {
  h1: (props: any) => <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />,
  h2: (props: any) => <h2 className="mt-8 mb-4 text-2xl font-bold" {...props} />,
  h3: (props: any) => <h3 className="mt-6 mb-3 text-xl font-bold" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="mb-4 ml-6 space-y-2 list-disc" {...props} />,
  ol: (props: any) => <ol className="mb-4 ml-6 space-y-2 list-decimal" {...props} />,
  li: (props: any) => <li className="text-gray-700" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="mb-4 border-l-4 border-emerald-500 pl-4 italic text-gray-700" {...props} />
  ),
  a: (props: any) => (
    <a className="text-emerald-600 hover:underline" {...props} />
  ),
  code: (props: any) => (
    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4 text-gray-100" {...props} />
  ),
  table: (props: any) => (
    <table className="mb-4 w-full border-collapse border border-gray-300" {...props} />
  ),
  th: (props: any) => (
    <th className="border border-gray-300 bg-gray-100 p-3 text-left font-bold" {...props} />
  ),
  td: (props: any) => <td className="border border-gray-300 p-3" {...props} />,
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const article = await getArticle(params.category, params.slug)

  if (!article) {
    notFound()
  }

  return (
    <WikiLayout>
      <ArticleWrapper metadata={article.metadata}>
        <MDXRemote
          source={article.content}
          components={mdxComponents}
        />
      </ArticleWrapper>

      {/* Breadcrumb Navigation */}
      <nav className="mt-12 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-600">
          <Link href="/wiki" className="hover:text-emerald-600">
            Home
          </Link>
          {' › '}
          <Link href={`/wiki/${params.category}`} className="hover:text-emerald-600">
            {params.category}
          </Link>
          {' › '}
          <span>{article.metadata.title}</span>
        </div>
      </nav>
    </WikiLayout>
  )
}
