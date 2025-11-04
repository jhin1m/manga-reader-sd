import { defaultMetadata } from "@/lib/seo/config";
import { generateWebsiteSchema } from "@/lib/seo/json-ld";
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
export default function HomePage() {
  // Generate JSON-LD schema for homepage
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Page Content (Client Component) */}
      <HomePageContent />
    </>
  );
}
