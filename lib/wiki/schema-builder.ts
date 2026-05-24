/**
 * Schema Markup Generator for Wiki Articles
 * Generates JSON-LD for Article, FAQ, and LocalBusiness schemas
 */

export interface ArticleSchema {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
  }
  publisher?: {
    '@type': string
    name: string
    logo?: {
      '@type': string
      url: string
    }
  }
  mainEntity?: {
    '@type': string
    text: string
  }
}

export interface FAQSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export interface LocalBusinessSchema {
  '@context': string
  '@type': string
  name: string
  image: string
  description: string
  address: {
    '@type': string
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  url: string
  sameAs?: string[]
}

/**
 * Generate Article Schema
 */
export function generateArticleSchema(
  article: {
    title: string
    description: string
    author: string
    reviewer?: string
    datePublished: string
    dateUpdated: string
    image?: string
  },
  url: string
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateUpdated,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EWasteKochi',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ewastekochi.com/logo.png',
      },
    },
  }
}

/**
 * Generate FAQ Schema from article FAQs
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate LocalBusiness Schema for EWasteKochi
 */
export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'EWasteKochi',
    image: 'https://ewastekochi.com/logo.png',
    description:
      'Circular economy company specializing in e-waste recycling and IT asset disposition',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kakkanad, Kochi',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      postalCode: '682030',
      addressCountry: 'IN',
    },
    telephone: '+91-XXXX-XXXX',
    url: 'https://ewastekochi.com',
    sameAs: [
      'https://www.linkedin.com/company/ewastekochi',
      'https://twitter.com/ewastekochi',
    ],
  }
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Generate HowTo Schema (for ITAD and recycling processes)
 */
export function generateHowToSchema(
  title: string,
  steps: Array<{ name: string; text: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
