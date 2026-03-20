/**
 * Server-side QueryClient Factory
 * Creates a cached QueryClient instance for server-side rendering
 */

import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { STALE_TIMES, GC_TIMES } from "@/lib/constants";

/**
 * Create and cache a QueryClient instance for server-side rendering
 * Uses React's cache() to ensure we get the same instance within a single request
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: STALE_TIMES.DEFAULT,
          gcTime: GC_TIMES.DEFAULT,
          refetchOnWindowFocus: false,
        },
      },
    })
);
