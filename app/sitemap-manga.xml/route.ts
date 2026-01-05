/**
 * Manga Sitemap Route Handler
 * Serves sitemap for manga detail pages at /sitemap-manga.xml
 */

import { siteConfig } from "@/lib/seo/config";
// Using limited fetcher to avoid rate limiting (temporary)
// TODO: Switch to fetchAllMangas once rate limits are configured
import {
  fetchLimitedMangas,
  parseDate,
} from "@/lib/seo/sitemap-helpers-limited";

// Revalidate daily (24 hours)
export const revalidate = 86400;

export async function GET() {
  const baseUrl = siteConfig.url;

  try {
    const allMangas = await fetchLimitedMangas(50);

    const mangaRoutes = allMangas.map((manga) => ({
      url: `${baseUrl}/manga/${manga.slug}`,
      lastModified: parseDate(manga.updated_at).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mangaRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("[Sitemap] Error generating manga sitemap:");
    console.error(error);

    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new Response(emptySitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
