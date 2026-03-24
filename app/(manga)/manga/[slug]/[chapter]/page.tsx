/**
 * Chapter Reader Page
 * Server component with SSR prefetch, SEO metadata
 */

import type { Metadata } from "next";
import { cache } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { generateChapterMetadata } from "@/lib/seo/metadata";
import { chapterApi } from "@/lib/api/endpoints/chapter";
import { getQueryClient } from "@/lib/api/query-client";
import { ReaderView } from "@/components/reader/reader-view";
import type { ChapterWithNavigation } from "@/types/chapter";

interface PageProps {
  params: Promise<{
    slug: string;
    chapter: string;
  }>;
}

// Cache chapter fetch to deduplicate between generateMetadata and page component
const getChapterData = cache(async (mangaSlug: string, chapterSlug: string) => {
  const [chapterData, imagesData] = await Promise.all([
    chapterApi.getDetail(mangaSlug, chapterSlug),
    chapterApi.getImages(mangaSlug, chapterSlug),
  ]);
  return {
    ...chapterData,
    content: imagesData.images,
  } as ChapterWithNavigation;
});

/**
 * Generate metadata for chapter reader page using centralized SEO config
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug, chapter } = await params;
    const chapterData = await getChapterData(slug, chapter);

    return generateChapterMetadata(chapterData);
  } catch {
    return {
      title: "Chapter Not Found",
      description: "The requested chapter could not be found.",
    };
  }
}

/**
 * Chapter Reader Page Component
 * Prefetches chapter data + images on server and passes to client via HydrationBoundary
 */
export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapter } = await params;

  // Prefetch chapter data into QueryClient for instant client hydration
  const queryClient = getQueryClient();
  try {
    const chapterData = await getChapterData(slug, chapter);
    queryClient.setQueryData(["chapter", slug, chapter], chapterData);
  } catch {
    // Client will handle error state
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ReaderView key={chapter} mangaSlug={slug} chapterSlug={chapter} />
    </HydrationBoundary>
  );
}
