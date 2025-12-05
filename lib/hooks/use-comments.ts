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
} from "@/types/comment";

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

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => mangaApi.addComment(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.manga(slug) });
    },
  });
}

/**
 * Hook for adding chapter comment
 */
export function useAddChapterComment(mangaSlug: string, chapterSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      chapterApi.addComment(mangaSlug, chapterSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.chapter(mangaSlug, chapterSlug),
      });
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
