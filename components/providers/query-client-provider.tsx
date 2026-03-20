"use client";

/**
 * React Query Provider
 * Client component wrapper for TanStack Query (React Query)
 * Provides QueryClient to the entire application for data fetching and caching
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { STALE_TIMES, GC_TIMES } from "@/lib/constants";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * ReactQueryProvider component
 * Creates a QueryClient instance and provides it to children components
 * Uses useState to ensure QueryClient is created once per component lifecycle
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
            staleTime: STALE_TIMES.DEFAULT,
            gcTime: GC_TIMES.DEFAULT,
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
