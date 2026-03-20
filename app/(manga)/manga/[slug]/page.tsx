/**
 * Manga Detail Page
 * Server component with SSR prefetch, SEO metadata, and JSON-LD schemas
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { generateMangaMetadata } from "@/lib/seo/metadata";
import {
  generateMangaSchema,
  generateBreadcrumbSchema,
  combineSchemas,
} from "@/lib/seo/json-ld";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { getQueryClient } from "@/lib/api/query-client";
import { mangaKeys } from "@/lib/api/query-keys";
import { MangaDetailContent } from "./manga-detail-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Cache the manga fetch to deduplicate between generateMetadata and page component
const getMangaDetail = cache(async (slug: string) => {
  return mangaApi.getDetail(slug);
});

/**
 * Generate metadata for manga detail page
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const manga = await getMangaDetail(slug);

    return generateMangaMetadata(manga);
  } catch {
    return {
      title: "Manga Not Found",
      description: "The requested manga could not be found.",
    };
  }
}

/**
 * Manga Detail Page Component
 * Prefetches manga data on server and passes to client via HydrationBoundary
 */
export default async function MangaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch manga data (deduplicated with generateMetadata via cache())
  let manga;
  try {
    manga = await getMangaDetail(slug);
  } catch {
    notFound();
  }

  // Prefetch manga data into QueryClient for client hydration
  const queryClient = getQueryClient();
  queryClient.setQueryData(mangaKeys.detail(slug), manga);
  const dehydratedState = dehydrate(queryClient);

  // Generate JSON-LD schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Manga", url: "/manga" },
    { name: manga.name, url: `/manga/${manga.slug}` },
  ]);
  const mangaSchema = generateMangaSchema(manga);
  const schemas = combineSchemas([breadcrumbSchema, mangaSchema]);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* Client Content with hydrated query data */}
      <HydrationBoundary state={dehydratedState}>
        <MangaDetailContent slug={slug} />
      </HydrationBoundary>
    </>
  );
}
