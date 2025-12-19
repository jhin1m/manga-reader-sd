"use client";

/**
 * Library Hooks
 * Custom React Query hooks for user library data (favorites, history, etc.)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userFavoritesApi, userHistoryApi } from "@/lib/api/endpoints/user";
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

// === Mutation Hooks ===

/**
 * Hook for removing manga from reading history
 * Uses optimistic update for instant UI feedback
 */
export function useRemoveFromHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => userHistoryApi.remove(mangaId),

    onMutate: async (mangaId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: libraryKeys.all });

      // Snapshot all history queries for rollback
      const previousHistoryQueries = queryClient.getQueriesData<
        PaginatedResponse<ReadingHistoryItem>
      >({
        queryKey: ["library", "history"],
      });

      const previousContinueReading = queryClient.getQueryData<
        PaginatedResponse<ReadingHistoryItem>
      >(libraryKeys.continueReading());

      // Optimistically remove from all history caches
      queryClient.setQueriesData<PaginatedResponse<ReadingHistoryItem>>(
        { queryKey: ["library", "history"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.manga.id !== mangaId),
            meta: {
              ...oldData.meta,
              pagination: {
                ...oldData.meta.pagination,
                total: oldData.meta.pagination.total - 1,
              },
            },
          };
        }
      );

      // Also update continue reading cache
      queryClient.setQueryData<PaginatedResponse<ReadingHistoryItem>>(
        libraryKeys.continueReading(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.manga.id !== mangaId),
          };
        }
      );

      return { previousHistoryQueries, previousContinueReading };
    },

    onError: (_err, _mangaId, context) => {
      // Rollback on error
      if (context?.previousHistoryQueries) {
        context.previousHistoryQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousContinueReading) {
        queryClient.setQueryData(
          libraryKeys.continueReading(),
          context.previousContinueReading
        );
      }
      console.error("Failed to remove from history:", _err);
    },

    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["library", "history"] });
      queryClient.invalidateQueries({
        queryKey: libraryKeys.continueReading(),
      });
    },
  });
}

/**
 * Hook for removing manga from favorites/bookmarks
 * Uses optimistic update for instant UI feedback
 */
export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => userFavoritesApi.remove(mangaId),

    onMutate: async (mangaId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: libraryKeys.all });

      // Snapshot all favorites queries for rollback (use partial key match)
      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<FavoriteManga>
      >({
        queryKey: ["library", "favorites"],
      });

      // Optimistically remove from all favorites caches (use partial key match)
      queryClient.setQueriesData<PaginatedResponse<FavoriteManga>>(
        { queryKey: ["library", "favorites"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((manga) => manga.id !== mangaId),
            meta: {
              ...oldData.meta,
              pagination: {
                ...oldData.meta.pagination,
                total: oldData.meta.pagination.total - 1,
              },
            },
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _mangaId, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Failed to remove bookmark:", _err);
    },

    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["library", "favorites"] });
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
