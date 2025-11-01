/**
 * Manga API Endpoints
 * All endpoints related to manga content
 */

import { apiClient } from "../client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Manga,
  MangaListItem,
  MangaListParams,
  MangaSearchParams,
  Genre,
  GenreMangasParams,
  Artist,
  Group,
  Doujinshi,
} from "@/types/manga";
import type { ChapterListItem, ChapterListParams } from "@/types/chapter";

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
 * Manga API
 */
export const mangaApi = {
  /**
   * Get paginated list of mangas with filtering and sorting
   * GET /mangas
   */
  getList: async (
    params?: MangaListParams
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(`/mangas${query}`);
  },

  /**
   * Get recently updated mangas
   * GET /mangas/recent
   */
  getRecent: async (
    params?: Partial<MangaListParams>
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/mangas/recent${query}`
    );
  },

  /**
   * Get hot/trending mangas
   * GET /mangas/hot
   */
  getHot: async (
    params?: Partial<MangaListParams>
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/mangas/hot${query}`
    );
  },

  /**
   * Search mangas by name
   * GET /mangas/search
   */
  search: async (
    params: MangaSearchParams
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/mangas/search${query}`
    );
  },

  /**
   * Get specific manga details
   * GET /mangas/{slug}
   */
  getDetail: async (slug: string): Promise<Manga> => {
    return apiClient.get<Manga>(`/mangas/${slug}`);
  },

  /**
   * Get all chapters for a specific manga
   * GET /mangas/{slug}/chapters
   */
  getChapters: async (
    slug: string,
    params?: ChapterListParams
  ): Promise<PaginatedResponse<ChapterListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<ChapterListItem>>(
      `/mangas/${slug}/chapters${query}`
    );
  },
};

/**
 * Genre API
 */
export const genreApi = {
  /**
   * Get all genres
   * GET /genres
   */
  getList: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Genre>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<Genre>>(`/genres${query}`);
  },

  /**
   * Get specific genre details
   * GET /genres/{slug}
   */
  getDetail: async (slug: string): Promise<Genre> => {
    return apiClient.get<Genre>(`/genres/${slug}`);
  },

  /**
   * Get mangas for a specific genre
   * GET /genres/{slug}/mangas
   */
  getMangas: async (
    slug: string,
    params?: GenreMangasParams
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/genres/${slug}/mangas${query}`
    );
  },
};

/**
 * Artist API
 */
export const artistApi = {
  /**
   * Get all artists
   * GET /artists
   */
  getList: async (params?: {
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Artist>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<Artist>>(`/artists${query}`);
  },

  /**
   * Get specific artist details
   * GET /artists/{slug}
   */
  getDetail: async (slug: string): Promise<Artist> => {
    return apiClient.get<Artist>(`/artists/${slug}`);
  },

  /**
   * Get mangas by a specific artist
   * GET /artists/{slug}/mangas
   */
  getMangas: async (
    slug: string,
    params?: { per_page?: number; page?: number }
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/artists/${slug}/mangas${query}`
    );
  },
};

/**
 * Group API (Translation groups)
 */
export const groupApi = {
  /**
   * Get all translation groups
   * GET /groups
   */
  getList: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Group>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<Group>>(`/groups${query}`);
  },

  /**
   * Get specific group details
   * GET /groups/{slug}
   */
  getDetail: async (slug: string): Promise<Group> => {
    return apiClient.get<Group>(`/groups/${slug}`);
  },

  /**
   * Get mangas by a translation group
   * GET /groups/{slug}/mangas
   */
  getMangas: async (
    slug: string,
    params?: { per_page?: number; page?: number }
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/groups/${slug}/mangas${query}`
    );
  },
};

/**
 * Doujinshi API
 */
export const doujinshiApi = {
  /**
   * Get all doujinshi categories
   * GET /doujinshis
   */
  getList: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Doujinshi>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<Doujinshi>>(`/doujinshis${query}`);
  },

  /**
   * Get specific doujinshi category details
   * GET /doujinshis/{slug}
   */
  getDetail: async (slug: string): Promise<Doujinshi> => {
    return apiClient.get<Doujinshi>(`/doujinshis/${slug}`);
  },

  /**
   * Get mangas in a doujinshi category
   * GET /doujinshis/{slug}/mangas
   */
  getMangas: async (
    slug: string,
    params?: { per_page?: number; page?: number }
  ): Promise<PaginatedResponse<MangaListItem>> => {
    const query = buildQueryString(params);
    return apiClient.get<PaginatedResponse<MangaListItem>>(
      `/doujinshis/${slug}/mangas${query}`
    );
  },
};
