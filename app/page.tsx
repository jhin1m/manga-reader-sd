import { defaultMetadata } from "@/lib/seo/config";
import { generateWebsiteSchema } from "@/lib/seo/json-ld";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { HomePageContent } from "./home-content";

/**
 * Homepage Metadata
 * Uses centralized SEO configuration from lib/seo/config.ts
 */
export const metadata = defaultMetadata;

/**
 * Homepage (Server Component)
 * Main landing page with SEO metadata and JSON-LD schema
 */
export default async function HomePage() {
  // Generate JSON-LD schema for homepage
  const websiteSchema = generateWebsiteSchema();

  // Fetch hot mangas on server for LCP optimization
  let hotMangas;
  try {
    const response = await mangaApi.getHot({
      per_page: 8,
      include: "genres,artist,latest_chapter",
    });
    hotMangas = response.data;
  } catch (error) {
    console.error("Failed to fetch hot mangas on server:", error);
    // Ignore error, client-side will try to fetch or handle empty state
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Page Content (Client Component) */}
      <HomePageContent initialCarouselMangas={hotMangas} />
    </>
  );
}
