import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Wiki - EWasteKochi',
  description: 'Comprehensive knowledge base for e-waste recycling, ITAD, compliance, and circular economy.',
}

export default function WikiHomepage() {
  const categories = [
    {
      name: 'Recycling Encyclopedia',
      slug: 'recycling',
      description: 'Device-type specific recycling workflows and best practices',
      icon: '♻️',
      count: 80,
    },
    {
      name: 'Compliance Standards',
      slug: 'compliance',
      description: 'DPDP, CPCB, KSPCB, EPR and other regulatory frameworks',
      icon: '⚖️',
      count: 50,
    },
    {
      name: 'ITAD Knowledge Base',
      slug: 'itad',
      description: 'Enterprise asset disposition processes and standards',
      icon: '💼',
      count: 45,
    },
    {
      name: 'Data Destruction',
      slug: 'data-destruction',
      description: 'NIST 800-88, sanitization methods, and secure disposal',
      icon: '🔐',
      count: 30,
    },
    {
      name: 'ESG Intelligence',
      slug: 'esg',
      description: 'Carbon footprint, circular economy, and sustainability metrics',
      icon: '🌱',
      count: 30,
    },
    {
      name: 'Material Intelligence',
      slug: 'materials',
      description: 'Metal extraction, material recovery, and resource optimization',
      icon: '⚙️',
      count: 40,
    },
  ]

  return (
    <WikiLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 px-8 py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            EWasteKochi Knowledge Base
          </h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-700">
            A comprehensive wiki for circular economy, e-waste recycling, ITAD, compliance, and environmental responsibility. Explore our knowledge base with 150+ articles across 7 core categories.
          </p>
          <Link
            href="#categories"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Explore Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div id="categories" className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/wiki/${cat.slug}`}
                className="group rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="mb-3 text-3xl">{cat.icon}</div>
                <h3 className="mb-2 font-bold text-gray-900 group-hover:text-emerald-700">
                  {cat.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600">{cat.description}</p>
                <p className="text-xs font-medium text-emerald-600">
                  {cat.count} articles →
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg bg-gray-50 p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Quick Start</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/wiki/compliance"
              className="rounded-lg bg-white p-4 hover:bg-blue-50"
            >
              <h3 className="font-semibold text-gray-900">New to Compliance?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Start with our compliance standards guide
              </p>
            </Link>
            <Link
              href="/wiki/itad"
              className="rounded-lg bg-white p-4 hover:bg-violet-50"
            >
              <h3 className="font-semibold text-gray-900">Understanding ITAD</h3>
              <p className="mt-2 text-sm text-gray-600">
                Learn enterprise asset disposition
              </p>
            </Link>
            <Link
              href="/wiki/data-destruction"
              className="rounded-lg bg-white p-4 hover:bg-red-50"
            >
              <h3 className="font-semibold text-gray-900">Data Security</h3>
              <p className="mt-2 text-sm text-gray-600">
                NIST 800-88 sanitization standards
              </p>
            </Link>
            <Link
              href="/wiki/recycling"
              className="rounded-lg bg-white p-4 hover:bg-emerald-50"
            >
              <h3 className="font-semibold text-gray-900">Recycling Basics</h3>
              <p className="mt-2 text-sm text-gray-600">
                Device-specific recycling workflows
              </p>
            </Link>
          </div>
        </div>
      </div>
    </WikiLayout>
  )
}
