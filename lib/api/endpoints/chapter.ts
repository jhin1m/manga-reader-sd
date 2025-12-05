/**
 * Chapter API Endpoints
 * All endpoints related to chapter reading and reporting
 */

import { apiClient } from "../client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Chapter,
  ChapterImagesResponse,
  TrackViewResponse,
  ChapterReportTypesResponse,
  ChapterReport,
  CreateChapterReportRequest,
} from "@/types/chapter";
import type {
  Comment,
  CommentListParams,
  CreateCommentRequest,
} from "@/types/comment";

/**
 * Build query string from params object
 */
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Chapter API
 */
export const chapterApi = {
  /**
   * Get chapter details with content and navigation
   * GET /mangas/{mangaSlug}/chapters/{chapterSlug}
   */
  getDetail: async (
    mangaSlug: string,
    chapterSlug: string
  ): Promise<Chapter> => {
    return apiClient.get<Chapter>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}`
    );
  },

  /**
   * Get chapter images for reading interface
   * GET /mangas/{mangaSlug}/chapters/{chapterSlug}/images
   * Note: Automatically tracks reading history for authenticated users
   */
  getImages: async (
    mangaSlug: string,
    chapterSlug: string
  ): Promise<ChapterImagesResponse> => {
    return apiClient.get<ChapterImagesResponse>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}/images`
    );
  },

  /**
   * Increment chapter and manga view counters
   * POST /mangas/{mangaSlug}/chapters/{chapterSlug}/views
   */
  trackView: async (
    mangaSlug: string,
    chapterSlug: string
  ): Promise<TrackViewResponse> => {
    return apiClient.post<TrackViewResponse>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}/views`
    );
  },

  /**
   * Get comments for a chapter
   * GET /mangas/{mangaSlug}/chapters/{chapterSlug}/comments
   */
  getComments: async (
    mangaSlug: string,
    chapterSlug: string,
    params?: CommentListParams
  ): Promise<PaginatedResponse<Comment>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<Comment>>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}/comments${query}`
    );
  },

  /**
   * Add comment to a chapter (or reply to another comment)
   * POST /mangas/{mangaSlug}/chapters/{chapterSlug}/comments
   */
  addComment: async (
    mangaSlug: string,
    chapterSlug: string,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    // Only include parent_id if it's a valid number (not null or undefined)
    const requestData = {
      content: data.content,
      ...(data.parent_id !== null &&
        data.parent_id !== undefined && { parent_id: data.parent_id }),
    };
    return apiClient.post<Comment>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}/comments`,
      requestData
    );
  },
};

/**
 * Chapter Report API
 */
export const chapterReportApi = {
  /**
   * Get available chapter report types
   * GET /chapter-reports/types
   */
  getTypes: async (): Promise<ChapterReportTypesResponse> => {
    return apiClient.get<ChapterReportTypesResponse>("/chapter-reports/types");
  },

  /**
   * Submit a chapter error report
   * POST /mangas/{mangaSlug}/chapters/{chapterSlug}/reports
   */
  create: async (
    mangaSlug: string,
    chapterSlug: string,
    data: CreateChapterReportRequest
  ): Promise<ChapterReport> => {
    return apiClient.post<ChapterReport>(
      `/mangas/${mangaSlug}/chapters/${chapterSlug}/reports`,
      data
    );
  },

  /**
   * Get user's submitted chapter reports
   * GET /user/chapter-reports
   */
  getUserReports: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<ChapterReport>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<ChapterReport>>(
      `/user/chapter-reports${query}`
    );
  },
};
