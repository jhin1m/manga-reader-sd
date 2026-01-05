/**
 * Chapter Sitemap Route Handler
 * Serves sitemap for chapter reader pages at /sitemap-chapters.xml
 */

import { siteConfig } from "@/lib/seo/config";
// Using limited fetcher to avoid rate limiting (temporary)
// TODO: Switch to fetchAllChapters once rate limits are configured
import {
  fetchLimitedMangas,
  fetchLimitedChapters,
  parseDate,
} from "@/lib/seo/sitemap-helpers-limited";

// Revalidate weekly (7 days)
export const revalidate = 604800;

export async function GET() {
  const baseUrl = siteConfig.url;

  try {
    // Fetch limited manga to avoid rate limiting
    const allMangas = await fetchLimitedMangas(10); // Limit to 10 manga
    const chapterRoutes: Array<{
      url: string;
      lastModified: string;
      changeFrequency: string;
      priority: number;
    }> = [];

    // Fetch chapters for each limited manga
    for (const manga of allMangas) {
      const chapters = await fetchLimitedChapters(manga.slug, 20); // 20 chapters per manga
      chapters.forEach((chapter) => {
        chapterRoutes.push({
          url: `${baseUrl}/manga/${manga.slug}/${chapter.slug}`,
          lastModified: parseDate(chapter.updated_at).toISOString(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chapterRoutes
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
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating chapter sitemap:", error);

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
