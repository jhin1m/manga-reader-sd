/**
 * Limited Sitemap Helpers (For Testing/Development)
 * Fetches only first page to avoid rate limiting
 * Use sitemap-helpers.ts for production with proper backend configuration
 */

import type { MangaListItem } from "@/types/manga";
import type { ChapterListItem } from "@/types/chapter";
import { mangaApi } from "@/lib/api/endpoints/manga";

/**
 * Fetch limited manga from API (first page only)
 * For development/testing to avoid rate limits
 */
export async function fetchLimitedMangas(limit = 50): Promise<MangaListItem[]> {
  try {
    console.log(`[Sitemap] Fetching limited mangas (max: ${limit})...`);
    const response = await mangaApi.getList({ page: 1, per_page: limit });
    console.log(`[Sitemap] Fetched ${response.data.length} mangas`);
    return response.data;
  } catch (error) {
    console.error("[Sitemap] Error fetching limited mangas:", error);
    return [];
  }
}

/**
 * Fetch limited chapters for a manga (first page only)
 */
export async function fetchLimitedChapters(
  mangaSlug: string,
  limit = 50
): Promise<ChapterListItem[]> {
  try {
    const response = await mangaApi.getChapters(mangaSlug, {
      page: 1,
      per_page: limit,
    });
    return response.data;
  } catch (error) {
    console.error(
      `[Sitemap] Error fetching limited chapters for ${mangaSlug}:`,
      error
    );
    return [];
  }
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
