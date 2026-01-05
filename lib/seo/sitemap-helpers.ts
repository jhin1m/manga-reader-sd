/**
 * Sitemap Helper Utilities
 * Common functions for generating sitemaps
 */

import type { MangaListItem } from "@/types/manga";
import type { ChapterListItem } from "@/types/chapter";
import { mangaApi } from "@/lib/api/endpoints/manga";

/**
 * Delay helper to avoid API rate limiting
 * @param ms - Milliseconds to delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Configuration for sitemap generation
 */
const SITEMAP_CONFIG = {
  DELAY_BETWEEN_PAGES: 500, // Increased delay between pagination requests
  DELAY_BETWEEN_MANGA: 600, // Increased delay between manga chapter fetches
  MAX_RETRIES: 3, // Number of retries on failure
  RETRY_DELAY: 1000, // Delay before retry
};

/**
 * Fetch all manga from API with pagination
 * Handles automatic pagination until all records are retrieved
 */
export async function fetchAllMangas(): Promise<MangaListItem[]> {
  const allMangas: MangaListItem[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await mangaApi.getList({ page, per_page: 100 });
      allMangas.push(...response.data);

      hasMore =
        response.meta.pagination.current_page <
        response.meta.pagination.last_page;
      page++;

      // Add delay to avoid rate limiting (only if there are more pages)
      if (hasMore) {
        await delay(SITEMAP_CONFIG.DELAY_BETWEEN_PAGES);
      }
    }

    return allMangas;
  } catch (error) {
    console.error("Error fetching all mangas:", error);
    return allMangas; // Return partial data rather than empty
  }
}

/**
 * Fetch all chapters for a specific manga
 * Handles pagination for large chapter lists
 */
export async function fetchMangaChapters(
  mangaSlug: string
): Promise<ChapterListItem[]> {
  const allChapters: ChapterListItem[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await mangaApi.getChapters(mangaSlug, {
        page,
        per_page: 100,
      });
      allChapters.push(...response.data);

      hasMore =
        response.meta.pagination.current_page <
        response.meta.pagination.last_page;
      page++;

      // Add delay to avoid rate limiting (only if there are more pages)
      if (hasMore) {
        await delay(SITEMAP_CONFIG.DELAY_BETWEEN_PAGES);
      }
    }

    return allChapters;
  } catch (error) {
    console.error(`Error fetching chapters for ${mangaSlug}:`, error);
    return allChapters; // Return partial data rather than empty
  }
}

/**
 * Fetch all chapters for all manga
 * Returns array of chapter data with manga slug included
 */
export async function fetchAllChapters(): Promise<
  Array<{
    mangaSlug: string;
    chapters: ChapterListItem[];
  }>
> {
  const allMangas = await fetchAllMangas();
  const allChaptersData: Array<{
    mangaSlug: string;
    chapters: ChapterListItem[];
  }> = [];

  // Fetch chapters for each manga with delay between manga requests
  for (let i = 0; i < allMangas.length; i++) {
    const manga = allMangas[i];
    const chapters = await fetchMangaChapters(manga.slug);
    if (chapters.length > 0) {
      allChaptersData.push({
        mangaSlug: manga.slug,
        chapters,
      });
    }

    // Add delay between manga chapter fetches to avoid rate limiting
    if (i < allMangas.length - 1) {
      await delay(SITEMAP_CONFIG.DELAY_BETWEEN_MANGA);
    }
  }

  return allChaptersData;
}

/**
 * Parse ISO date string to Date object
 * Fallback to current date if invalid
 */
export function parseDate(dateString: string | undefined): Date {
  if (!dateString) return new Date();

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}
