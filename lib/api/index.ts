/**
 * API Module Barrel Export
 * Central export point for all API functionality
 */

// Export API client and error class
export { apiClient, ApiClientError } from "./client";

// Export configuration
export * from "./config";

// Export all endpoint modules
export { authApi } from "./endpoints/auth";
export {
  mangaApi,
  genreApi,
  artistApi,
  groupApi,
  doujinshiApi,
} from "./endpoints/manga";
export { chapterApi, chapterReportApi } from "./endpoints/chapter";
export {
  userFavoritesApi,
  userHistoryApi,
  userAchievementsApi,
  userPetsApi,
} from "./endpoints/user";
export { commentApi, ratingApi } from "./endpoints/comment";

// Export commonly used types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  ListParams,
} from "@/types/api";

export type {
  User,
  Pet,
  Achievement,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/user";

export type {
  Manga,
  MangaListItem,
  Genre,
  Artist,
  Group,
  MangaStatus,
} from "@/types/manga";

export type {
  Chapter,
  ChapterListItem,
  ReadingHistoryItem,
} from "@/types/chapter";

export type { Comment, Rating } from "@/types/comment";
