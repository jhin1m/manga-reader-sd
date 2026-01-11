/**
 * Service Worker Cache Configuration
 *
 * Centralized config for cache management.
 * Note: These values are duplicated in sw.js since SW runs in separate context.
 * Keep them in sync when updating.
 */

const DEBUG = process.env.NODE_ENV === "development";

export const SW_CACHE_CONFIG = {
  VERSION: "v1",

  // Cache names
  CACHES: {
    STATIC: "static-v1",
    API: "api-v1",
  },

  // Max entries per cache
  MAX_ENTRIES: {
    STATIC: 100,
    API: 50,
  },

  // API TTL (milliseconds)
  TTL: {
    MANGA_LIST: 5 * 60 * 1000, // 5 minutes
    MANGA_RECENT: 2 * 60 * 1000, // 2 minutes
    MANGA_HOT: 5 * 60 * 1000, // 5 minutes
    MANGA_DETAIL: 10 * 60 * 1000, // 10 minutes
    GENRES: 30 * 60 * 1000, // 30 minutes
  },
} as const;

/**
 * Helper to clear all SW caches
 * Call this when user logs out or on major app update
 */
export async function clearSwCaches(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("caches" in window)) return;

  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
  if (DEBUG) console.log("[Cache] All caches cleared");
}

/**
 * Helper to trigger SW update check
 */
export async function checkSwUpdate(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  await registration.update();
}

/**
 * Helper to send message to SW
 */
export function sendSwMessage(message: string): void {
  if (typeof window === "undefined") return;
  if (!navigator.serviceWorker?.controller) return;

  navigator.serviceWorker.controller.postMessage(message);
}
