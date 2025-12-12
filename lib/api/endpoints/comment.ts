/**
 * Comment and Rating API Endpoints
 * All endpoints related to comments and manga ratings
 */

import { apiClient } from "../client";
import type {
  Comment,
  UpdateCommentRequest,
  RateMangaRequest,
  RateMangaResponse,
} from "@/types/comment";

/**
 * Comment API
 */
export const commentApi = {
  /**
   * Update your own comment
   * PUT /comments/{id}
   */
  update: async (id: string, data: UpdateCommentRequest): Promise<Comment> => {
    return apiClient.put<Comment>(`/comments/${id}`, data);
  },

  /**
   * Delete your own comment
   * DELETE /comments/{id}
   * Note: If comment has replies, it will be soft-deleted
   */
  delete: async (id: string): Promise<null> => {
    return apiClient.delete<null>(`/comments/${id}`);
  },
};

/**
 * Rating API
 */
export const ratingApi = {
  /**
   * Rate a manga (or update existing rating)
   * POST /mangas/{slug}/rating
   */
  rateManga: async (
    slug: string,
    data: RateMangaRequest
  ): Promise<RateMangaResponse> => {
    return apiClient.post<RateMangaResponse>(`/mangas/${slug}/rating`, data);
  },
};
