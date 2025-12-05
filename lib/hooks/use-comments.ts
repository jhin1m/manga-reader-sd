"use client";

/**
 * Comments Hooks
 * Custom React Query hooks for comments data
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { chapterApi } from "@/lib/api/endpoints/chapter";
import type { PaginatedResponse } from "@/types/api";
import type {
  Comment,
  CommentListParams,
  CreateCommentRequest,
  MangaCommentParams,
  CommentableType,
} from "@/types/comment";
import { useRefreshUser } from "@/lib/hooks/use-refresh-user";
import { useAuthStore } from "@/lib/store/authStore";

// === Constants ===
const COMMENTS_STALE_TIME = 1000 * 60 * 5; // 5 minutes

// === Query Keys ===
/**
 * Comments Query Keys
 * Hierarchical pattern for cache management
 */
export const commentKeys = {
  all: ["comments"] as const,
  manga: (slug: string, params?: MangaCommentParams) =>
    [...commentKeys.all, "manga", slug, params] as const,
  chapter: (
    mangaSlug: string,
    chapterSlug: string,
    params?: CommentListParams
  ) => [...commentKeys.all, "chapter", mangaSlug, chapterSlug, params] as const,
};

// === Type Definitions ===
interface UseCommentsParams {
  page?: number;
  per_page?: number;
  sort?: "asc" | "desc";
  enabled?: boolean;
}

interface UseMangaCommentsParams extends UseCommentsParams {
  type?: "all" | "manga" | "chapter";
}

interface CommentsData {
  items: Comment[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// === Query Hooks ===

/**
 * Hook for fetching manga comments
 */
export function useMangaComments(
  slug: string,
  {
    page = 1,
    per_page = 20,
    sort = "desc",
    type = "manga",
    enabled = true,
  }: UseMangaCommentsParams = {}
) {
  return useQuery({
    queryKey: commentKeys.manga(slug, { page, per_page, sort, type }),
    queryFn: () => mangaApi.getComments(slug, { page, per_page, sort, type }),
    staleTime: COMMENTS_STALE_TIME,
    enabled: enabled && !!slug,
    select: (data: PaginatedResponse<Comment>): CommentsData => ({
      items: data.data,
      pagination: data.meta.pagination,
    }),
  });
}

/**
 * Hook for fetching chapter comments
 */
export function useChapterComments(
  mangaSlug: string,
  chapterSlug: string,
  {
    page = 1,
    per_page = 20,
    sort = "desc",
    enabled = true,
  }: UseCommentsParams = {}
) {
  return useQuery({
    queryKey: commentKeys.chapter(mangaSlug, chapterSlug, {
      page,
      per_page,
      sort,
    }),
    queryFn: () =>
      chapterApi.getComments(mangaSlug, chapterSlug, { page, per_page, sort }),
    staleTime: COMMENTS_STALE_TIME,
    enabled: enabled && !!mangaSlug && !!chapterSlug,
    select: (data: PaginatedResponse<Comment>): CommentsData => ({
      items: data.data,
      pagination: data.meta.pagination,
    }),
  });
}

// === Mutation Hooks ===

/**
 * Hook for adding manga comment
 */
export function useAddMangaComment(slug: string) {
  const queryClient = useQueryClient();
  const { refreshUserPartial } = useRefreshUser();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => mangaApi.addComment(slug, data),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: commentKeys.manga(slug) });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(
        commentKeys.manga(slug)
      );

      // Optimistically update to the new value
      const optimisticComment: Comment = {
        id: Date.now(), // temporary ID
        uuid: `temp-${Date.now()}`,
        content: newComment.content,
        commentable_type: "manga" as CommentableType,
        commentable_id: 0, // Will be replaced by real data
        parent_id: newComment.parent_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: user?.id || 0,
          uuid: user?.uuid || "",
          name: user?.name || "You",
          avatar_full_url: user?.avatar_full_url || "",
        },
        replies: [],
        replies_count: 0,
        can_edit: false,
        can_delete: false,
      };

      // Insert the new comment optimistically
      queryClient.setQueryData(
        commentKeys.manga(slug),
        (old: PaginatedResponse<Comment> | undefined) => {
          if (!old)
            return {
              data: [optimisticComment],
              meta: { pagination: { total: 1 } },
            };
          return {
            ...old,
            data: [optimisticComment, ...old.data],
          };
        }
      );

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.manga(slug),
          context.previousComments
        );
      }
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure server state
      await queryClient.invalidateQueries({
        queryKey: commentKeys.manga(slug),
      });

      // Refresh user data to get updated points
      try {
        await refreshUserPartial();
      } catch (error) {
        console.error("Failed to refresh user points after comment:", error);
        // Don't fail the mutation if user refresh fails
      }
    },
  });
}

/**
 * Hook for adding chapter comment
 */
export function useAddChapterComment(mangaSlug: string, chapterSlug: string) {
  const queryClient = useQueryClient();
  const { refreshUserPartial } = useRefreshUser();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      chapterApi.addComment(mangaSlug, chapterSlug, data),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: commentKeys.chapter(mangaSlug, chapterSlug),
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(
        commentKeys.chapter(mangaSlug, chapterSlug)
      );

      // Optimistically update to the new value
      const optimisticComment: Comment = {
        id: Date.now(), // temporary ID
        uuid: `temp-${Date.now()}`,
        content: newComment.content,
        commentable_type: "chapter" as CommentableType,
        commentable_id: 0, // Will be replaced by real data
        parent_id: newComment.parent_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: user?.id || 0,
          uuid: user?.uuid || "",
          name: user?.name || "You",
          avatar_full_url: user?.avatar_full_url || "",
        },
        replies: [],
        replies_count: 0,
        can_edit: false,
        can_delete: false,
      };

      // Insert the new comment optimistically
      queryClient.setQueryData(
        commentKeys.chapter(mangaSlug, chapterSlug),
        (old: PaginatedResponse<Comment> | undefined) => {
          if (!old)
            return {
              data: [optimisticComment],
              meta: { pagination: { total: 1 } },
            };
          return {
            ...old,
            data: [optimisticComment, ...old.data],
          };
        }
      );

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.chapter(mangaSlug, chapterSlug),
          context.previousComments
        );
      }
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure server state
      await queryClient.invalidateQueries({
        queryKey: commentKeys.chapter(mangaSlug, chapterSlug),
      });

      // Refresh user data to get updated points
      try {
        await refreshUserPartial();
      } catch (error) {
        console.error("Failed to refresh user points after comment:", error);
        // Don't fail the mutation if user refresh fails
      }
    },
  });
}

/**
 * Hook for prefetching comments
 */
export function useCommentsPrefetch() {
  const queryClient = useQueryClient();

  return {
    prefetchMangaComments: (slug: string, params?: MangaCommentParams) =>
      queryClient.prefetchQuery({
        queryKey: commentKeys.manga(slug, params),
        queryFn: () => mangaApi.getComments(slug, params),
        staleTime: COMMENTS_STALE_TIME,
      }),

    prefetchChapterComments: (
      mangaSlug: string,
      chapterSlug: string,
      params?: CommentListParams
    ) =>
      queryClient.prefetchQuery({
        queryKey: commentKeys.chapter(mangaSlug, chapterSlug, params),
        queryFn: () => chapterApi.getComments(mangaSlug, chapterSlug, params),
        staleTime: COMMENTS_STALE_TIME,
      }),
  };
}
