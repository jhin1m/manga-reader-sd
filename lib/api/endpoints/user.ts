/**
 * User API Endpoints
 * All endpoints related to user features (favorites, history, achievements, pets)
 */

import { apiClient } from "../client";
import type { PaginatedResponse } from "@/types/api";
import type { UserAchievements, UserPets } from "@/types/user";
import type {
  FavoriteManga,
  AddFavoriteRequest,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
} from "@/types/manga";
import type { ReadingHistoryItem } from "@/types/chapter";

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
 * User Favorites API
 */
export const userFavoritesApi = {
  /**
   * Get user's favorite mangas
   * GET /user/favorites
   */
  getList: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<FavoriteManga>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<FavoriteManga>>(
      `/user/favorites${query}`
    );
  },

  /**
   * Add manga to user's favorites
   * POST /user/favorites
   */
  add: async (data: AddFavoriteRequest): Promise<AddFavoriteResponse> => {
    return apiClient.post<AddFavoriteResponse>("/user/favorites", data);
  },

  /**
   * Remove manga from user's favorites
   * DELETE /user/favorites/{manga_id}
   */
  remove: async (mangaId: number): Promise<RemoveFavoriteResponse> => {
    return apiClient.delete<RemoveFavoriteResponse>(
      `/user/favorites/${mangaId}`
    );
  },
};

/**
 * User Reading History API
 */
export const userHistoryApi = {
  /**
   * Get user's reading history with last read chapter
   * GET /user/histories
   */
  getList: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<ReadingHistoryItem>> => {
    const query = buildQueryString(params as Record<string, unknown>);
    return apiClient.get<PaginatedResponse<ReadingHistoryItem>>(
      `/user/histories${query}`
    );
  },

  /**
   * Remove manga from user's reading history
   * DELETE /user/histories/{manga_id}
   */
  remove: async (mangaId: number): Promise<{ manga_id: number }> => {
    return apiClient.delete<{ manga_id: number }>(`/user/histories/${mangaId}`);
  },
};

/**
 * User Achievements API
 */
export const userAchievementsApi = {
  /**
   * Get user's achievements and progress
   * GET /user/achievements
   */
  get: async (): Promise<UserAchievements> => {
    return apiClient.get<UserAchievements>("/user/achievements");
  },
};

/**
 * User Pets API
 */
export const userPetsApi = {
  /**
   * Get user's pets and points information
   * GET /user/pets
   */
  get: async (): Promise<UserPets> => {
    return apiClient.get<UserPets>("/user/pets");
  },
};
