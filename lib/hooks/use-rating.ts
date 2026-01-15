"use client";

/**
 * Rating Hooks
 * Custom React Query hooks for manga rating functionality
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingApi } from "@/lib/api/endpoints/rating";
import { mangaKeys } from "@/lib/api/query-keys";
import type { RateMangaResponse } from "@/types/comment";
import type { Manga } from "@/types/manga";

/**
 * Hook for rating a manga
 * Handles optimistic updates and cache invalidation
 */
export function useRateManga(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: number) => ratingApi.rateManga(slug, { rating }),

    onMutate: async (newRating) => {
      // Cancel outgoing manga detail refetch
      await queryClient.cancelQueries({
        queryKey: mangaKeys.detail(slug),
      });

      // Snapshot previous manga data
      const previousManga = queryClient.getQueryData<Manga>(
        mangaKeys.detail(slug)
      );

      // Note: We don't optimistically update average_rating
      // because we don't know the new average until server responds
      // User rating will be shown via mutation.data after success

      return { previousManga };
    },

    onError: (err, newRating, context) => {
      // Rollback on error
      if (context?.previousManga) {
        queryClient.setQueryData(mangaKeys.detail(slug), context.previousManga);
      }
    },

    onSuccess: (data: RateMangaResponse) => {
      // Update manga with new average from server
      queryClient.setQueryData<Manga>(mangaKeys.detail(slug), (oldManga) => {
        if (!oldManga) return oldManga;
        return {
          ...oldManga,
          average_rating: data.manga_stats.average_rating,
          total_ratings: data.manga_stats.total_ratings,
        };
      });
    },

    onSettled: () => {
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: mangaKeys.detail(slug),
      });
    },
  });
}
