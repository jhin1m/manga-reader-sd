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
   * GET /chapters/{slug}
   */
  getDetail: async (slug: string): Promise<Chapter> => {
    return apiClient.get<Chapter>(`/chapters/${slug}`);
  },

  /**
   * Get chapter images for reading interface
   * GET /chapters/{slug}/images
   * Note: Automatically tracks reading history for authenticated users
   */
  getImages: async (slug: string): Promise<ChapterImagesResponse> => {
    return apiClient.get<ChapterImagesResponse>(`/chapters/${slug}/images`);
  },

  /**
   * Increment chapter and manga view counters
   * POST /chapters/{slug}/views
   */
  trackView: async (slug: string): Promise<TrackViewResponse> => {
    return apiClient.post<TrackViewResponse>(`/chapters/${slug}/views`);
  },

  /**
   * Get comments for a chapter
   * GET /chapters/{slug}/comments
   */
  getComments: async (
    slug: string,
    params?: CommentListParams
  ): Promise<PaginatedResponse<Comment>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<Comment>>(
      `/chapters/${slug}/comments${query}`
    );
  },

  /**
   * Add comment to a chapter (or reply to another comment)
   * POST /chapters/{slug}/comments
   */
  addComment: async (
    slug: string,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    return apiClient.post<Comment>(`/chapters/${slug}/comments`, data);
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
   * POST /chapters/{slug}/reports
   */
  create: async (
    slug: string,
    data: CreateChapterReportRequest
  ): Promise<ChapterReport> => {
    return apiClient.post<ChapterReport>(`/chapters/${slug}/reports`, data);
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
