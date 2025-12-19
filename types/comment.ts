/**
 * Comment and Rating Types
 * All types related to comments and manga ratings
 */

import type { ListParams } from "./api";
import type { UserBasic } from "./user";

/**
 * Commentable entity types
 */
export type CommentableType = "manga" | "chapter";

/**
 * Chapter info attached to chapter comments
 * Returned by API for chapter comments when fetching all comments
 */
export interface ChapterInfo {
  id: number;
  name: string;
  number: number | null;
  slug: string;
}

/**
 * Comment entity
 */
export interface Comment {
  id: string;
  uuid: string | null;
  content: string;
  commentable_type: string; // "App\\Models\\Manga" or "App\\Models\\Chapter"
  commentable_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user: UserBasic;
  replies: Comment[];
  replies_count: number;
  can_edit: boolean;
  can_delete: boolean;
  chapter_info?: ChapterInfo; // Only for chapter comments
}

/**
 * Create comment request
 */
export interface CreateCommentRequest {
  content: string;
  parent_id?: string | null;
}

/**
 * Update comment request
 */
export interface UpdateCommentRequest {
  content: string;
}

/**
 * Comment list query parameters
 */
export interface CommentListParams extends ListParams {
  sort?: "asc" | "desc";
}

/**
 * Manga comment list params
 * Extends base with type filter
 */
export interface MangaCommentParams extends CommentListParams {
  type?: "all" | "manga" | "chapter";
}

/**
 * Rating entity
 */
export interface Rating {
  id: number;
  uuid: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}

/**
 * Rate manga request
 */
export interface RateMangaRequest {
  rating: number; // 1-5, can use decimals like 4.5
}

/**
 * Rate manga response
 */
export interface RateMangaResponse {
  rating: Rating;
  manga_stats: {
    average_rating: number;
    total_ratings: number;
  };
}
