"use client";

/**
 * React Query Provider
 * Client component wrapper for TanStack Query (React Query)
 * Provides QueryClient to the entire application for data fetching and caching
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * ReactQueryProvider component
 * Creates a QueryClient instance and provides it to children components
 * Uses useState to ensure QueryClient is created once per component lifecycle
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // Create QueryClient instance once per component mount
  // This prevents creating new instances on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
