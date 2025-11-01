/**
 * Comment and Rating Types
 * All types related to comments and manga ratings
 */

import type { ListParams } from "./api";
import type { UserBasic } from "./user";

/**
 * Comment entity
 */
export interface Comment {
  id: number;
  uuid: string;
  content: string;
  commentable_type: string; // e.g., "App\\Models\\Chapter"
  commentable_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: UserBasic;
  replies: Comment[];
  replies_count: number;
  can_edit: boolean;
  can_delete: boolean;
}

/**
 * Create comment request
 */
export interface CreateCommentRequest {
  content: string;
  parent_id?: number | null;
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
