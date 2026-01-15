/**
 * Rating API Endpoints
 * All endpoints related to manga ratings
 */

import { apiClient } from "../client";
import type { RateMangaRequest, RateMangaResponse } from "@/types/comment";

/**
 * Rating API
 */
export const ratingApi = {
  /**
   * Rate a manga (or update existing rating)
   * POST /mangas/{slug}/rating
   * Requires: Bearer token (auth:sanctum)
   */
  rateManga: async (
    slug: string,
    data: RateMangaRequest
  ): Promise<RateMangaResponse> => {
    return apiClient.post<RateMangaResponse>(`/mangas/${slug}/rating`, data);
  },
};
