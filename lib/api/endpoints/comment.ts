/**
 * Comment and Rating API Endpoints
 * All endpoints related to comments and manga ratings
 */

import { apiClient } from "../client";
import { buildQueryString } from "@/lib/utils/query-string";
import type { PaginatedResponse } from "@/types/api";
import type {
  Comment,
  UpdateCommentRequest,
  RateMangaRequest,
  RateMangaResponse,
  CommentListParams,
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

  /**
   * Get recent comments across the system
   * GET /comments/recent
   */
  getRecent: async (
    params?: CommentListParams
  ): Promise<PaginatedResponse<Comment>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<Comment>>(
      `/comments/recent${query}`
    );
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
