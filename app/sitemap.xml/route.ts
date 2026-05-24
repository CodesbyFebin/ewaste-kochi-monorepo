import { buildSearchIndex } from '@/lib/wiki/search-index';
import path from 'path';
import { MetadataRoute } from 'next';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    const searchIndex = await buildSearchIndex(contentDir);
    const articles = searchIndex.getAllArticles();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wiki.ewastekochi.com';
    const currentDate = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/wiki</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/wiki/search</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}${article.url}</loc>
    <lastmod>${article.lastModified.split('T')[0]}</lastmod>
    <priority>${article.tier === 'T1' ? '0.9' : article.tier === 'T2' ? '0.8' : '0.7'}</priority>
    <changefreq>${article.tier === 'T1' ? 'weekly' : 'monthly'}</changefreq>
  </url>`
    )
    .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response('<?xml version="1.0"?><urlset></urlset>', {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
}
