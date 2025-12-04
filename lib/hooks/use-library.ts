"use client";

/**
 * Library Hooks
 * Custom React Query hooks for user library data (favorites, history, etc.)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userFavoritesApi, userHistoryApi } from "@/lib/api/endpoints/user";
import { MangaStatus } from "@/types/manga";
import type { PaginatedResponse } from "@/types/api";
import type { FavoriteManga } from "@/types/manga";
import type { ReadingHistoryItem } from "@/types/chapter";

// === Constants ===
const LIBRARY_STALE_TIME = 1000 * 60 * 5; // 5 minutes

// === Query Keys ===
/**
 * Library Query Keys
 * Hierarchical pattern for cache management
 */
export const libraryKeys = {
  all: ["library"] as const,
  favorites: (params?: { page?: number; per_page?: number }) =>
    [...libraryKeys.all, "favorites", params] as const,
  history: (params?: { page?: number; per_page?: number }) =>
    [...libraryKeys.all, "history", params] as const,
  continueReading: () => [...libraryKeys.all, "continue-reading"] as const,
};

// === Type Definitions ===
interface UseFavoritesParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

interface UseHistoryParams {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

interface UseCompletedMangaParams {
  page?: number;
  per_page?: number;
}

interface LibraryData<T> {
  items: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ContinueReadingData {
  items: ReadingHistoryItem[];
  hasMore: boolean;
}

// === Query Hooks ===

/**
 * Hook for fetching user's favorite manga with pagination
 */
export function useFavorites({
  page = 1,
  per_page = 20,
  enabled = true,
}: UseFavoritesParams = {}) {
  return useQuery({
    queryKey: libraryKeys.favorites({ page, per_page }),
    queryFn: () => userFavoritesApi.getList({ page, per_page }),
    staleTime: LIBRARY_STALE_TIME,
    enabled,
    select: (
      data: PaginatedResponse<FavoriteManga>
    ): LibraryData<FavoriteManga> => ({
      items: data.data,
      pagination: data.meta.pagination,
    }),
  });
}

/**
 * Hook for fetching user's reading history with pagination
 */
export function useHistory({
  page = 1,
  per_page = 20,
  enabled = true,
}: UseHistoryParams = {}) {
  return useQuery({
    queryKey: libraryKeys.history({ page, per_page }),
    queryFn: () => userHistoryApi.getList({ page, per_page }),
    staleTime: LIBRARY_STALE_TIME,
    enabled,
    select: (
      data: PaginatedResponse<ReadingHistoryItem>
    ): LibraryData<ReadingHistoryItem> => ({
      items: data.data,
      pagination: data.meta.pagination,
    }),
  });
}

/**
 * Continue Reading: First 5 items from history
 * Used for "Continue Reading" tab preview
 */
export function useContinueReading() {
  return useQuery({
    queryKey: libraryKeys.continueReading(),
    queryFn: () => userHistoryApi.getList({ per_page: 5, page: 1 }),
    staleTime: LIBRARY_STALE_TIME,
    select: (
      data: PaginatedResponse<ReadingHistoryItem>
    ): ContinueReadingData => ({
      items: data.data,
      hasMore: data.meta.pagination.last_page > 1,
    }),
  });
}

/**
 * Completed Manga: Filter favorites by status
 * Client-side filtering since no dedicated API
 */
export function useCompletedManga({
  page = 1,
  per_page = 20,
}: UseCompletedMangaParams = {}) {
  const favoritesQuery = useFavorites({ page, per_page, enabled: true });

  return {
    ...favoritesQuery,
    data: favoritesQuery.data
      ? {
          items: favoritesQuery.data.items.filter(
            (manga) => manga.status === MangaStatus.COMPLETED
          ),
          pagination: favoritesQuery.data.pagination,
        }
      : undefined,
  };
}

// === Mutation Hooks ===

/**
 * Hook for removing manga from reading history
 */
export function useRemoveFromHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => userHistoryApi.remove(mangaId),
    onSuccess: (_, mangaId) => {
      // Invalidate history queries
      queryClient.invalidateQueries({ queryKey: libraryKeys.history() });
      queryClient.invalidateQueries({
        queryKey: libraryKeys.continueReading(),
      });
    },
    onError: (error) => {
      // Error toast handled by component
      console.error("Failed to remove from history:", error);
    },
  });
}

// === Prefetch Hook ===

/**
 * Hook for prefetching library data
 * Used for smooth tab switching experience
 */
export function useLibraryPrefetch() {
  const queryClient = useQueryClient();

  return {
    prefetchFavorites: (params?: { page?: number; per_page?: number }) =>
      queryClient.prefetchQuery({
        queryKey: libraryKeys.favorites(params || { page: 1, per_page: 20 }),
        queryFn: () =>
          userFavoritesApi.getList(params || { page: 1, per_page: 20 }),
        staleTime: LIBRARY_STALE_TIME,
      }),

    prefetchHistory: (params?: { page?: number; per_page?: number }) =>
      queryClient.prefetchQuery({
        queryKey: libraryKeys.history(params || { page: 1, per_page: 20 }),
        queryFn: () =>
          userHistoryApi.getList(params || { page: 1, per_page: 20 }),
        staleTime: LIBRARY_STALE_TIME,
      }),

    prefetchContinueReading: () =>
      queryClient.prefetchQuery({
        queryKey: libraryKeys.continueReading(),
        queryFn: () => userHistoryApi.getList({ per_page: 5, page: 1 }),
        staleTime: LIBRARY_STALE_TIME,
      }),
  };
}
