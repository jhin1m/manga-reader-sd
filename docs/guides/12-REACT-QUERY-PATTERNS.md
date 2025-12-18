# React Query Patterns & Best Practices

**Advanced patterns for data fetching, caching, and state synchronization with TanStack Query v5**

**Prerequisites:**

- [State Management](./03-STATE-MANAGEMENT.md) - React Query basics
- [Performance Optimization](./10-PERFORMANCE-OPTIMIZATION.md) - Caching strategies
- [SSR Implementation](./11-SSR-IMPLEMENTATION.md) - Server-side rendering

---

## Table of Contents

- [Query Key Factory Pattern](#query-key-factory-pattern)
- [Advanced Query Patterns](#advanced-query-patterns)
- [Mutation Patterns](#mutation-patterns)
- [Prefetching Strategies](#prefetching-strategies)
- [Cache Synchronization](#cache-synchronization)
- [Error Handling](#error-handling)
- [Performance Patterns](#performance-patterns)
- [Testing Strategies](#testing-strategies)
- [Common Pitfalls](#common-pitfalls)

---

## Query Key Factory Pattern

### Centralized Query Keys

Create a centralized query key system for consistency and type safety:

```tsx
// lib/api/query-keys.ts
import type { FilterValues } from "@/components/browse/browse-filter-bar";

// Base keys - use `as const` for type inference
export const queryKeys = {
  // Manga-related
  manga: {
    all: ["manga"] as const,
    lists: () => [...queryKeys.manga.all, "list"] as const,
    list: (filters: FilterValues, page: number) =>
      [...queryKeys.manga.lists(), { filters, page }] as const,
    details: () => [...queryKeys.manga.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.manga.details(), slug] as const,
    search: (query: string, page: number) =>
      [...queryKeys.manga.all, "search", { query, page }] as const,
  },

  // Genre-related
  genres: {
    all: ["genres"] as const,
    lists: () => [...queryKeys.genres.all, "list"] as const,
  },

  // Chapter-related
  chapters: {
    all: ["chapters"] as const,
    list: (mangaSlug: string) =>
      [...queryKeys.chapters.all, mangaSlug] as const,
    detail: (chapterId: string) =>
      [...queryKeys.chapters.all, "chapter", chapterId] as const,
  },

  // User-related
  user: {
    all: ["user"] as const,
    library: (type: "favorites" | "history", page?: number) =>
      [...queryKeys.user.all, "library", type, page] as const,
    bookmarks: (mangaId?: number) =>
      [...queryKeys.user.all, "bookmarks", mangaId] as const,
  },

  // Comments
  comments: {
    all: ["comments"] as const,
    list: (mangaSlug: string, page: number) =>
      [...queryKeys.comments.all, mangaSlug, page] as const,
  },
} as const;
```

### Query Key Inheritance

```tsx
// Helper for cache invalidation
export const queryKeyHelpers = {
  // Invalidate all manga queries
  invalidateAllManga: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.manga.all });
  },

  // Invalidate specific manga and related data
  invalidateManga: (queryClient: QueryClient, slug: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.manga.detail(slug) });
    queryClient.invalidateQueries({ queryKey: queryKeys.chapters.list(slug) });
    queryClient.invalidateQueries({
      queryKey: queryKeys.comments.list(slug, 1),
    });
  },

  // Prefetch related data
  prefetchRelated: async (queryClient: QueryClient, manga: Manga) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.chapters.list(manga.slug),
        queryFn: () => chapterApi.getList(manga.slug),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.comments.list(manga.slug, 1),
        queryFn: () => commentApi.getList(manga.slug, 1),
      }),
    ]);
  },
};
```

---

## Advanced Query Patterns

### 1. Dependent Queries

```tsx
// Fetch chapters only after manga is loaded
export function useMangaWithChapters(slug: string) {
  const { data: manga, ...mangaQuery } = useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
    enabled: !!slug,
  });

  const { data: chapters, ...chaptersQuery } = useQuery({
    queryKey: queryKeys.chapters.list(slug),
    queryFn: () => chapterApi.getList(slug),
    enabled: !!manga, // Only run after manga is loaded
  });

  return {
    manga,
    chapters,
    isLoading: mangaQuery.isLoading || chaptersQuery.isLoading,
    error: mangaQuery.error || chaptersQuery.error,
  };
}
```

### 2. Pagination with Infinite Query

```tsx
export function useInfiniteMangaList(filters: FilterValues) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.manga.lists(), { filters, infinite: true }],
    queryFn: ({ pageParam = 1 }) =>
      mangaApi.getList(buildApiParams(filters, pageParam)),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.meta.pagination.current_page + 1;
      return nextPage <= lastPage.meta.pagination.last_page
        ? nextPage
        : undefined;
    },
    staleTime: 60_000,
  });
}
```

### 3. Selective Data Transformation

```tsx
// Transform data at query level for better performance
export function useMangaStats(slug: string) {
  return useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
    select: (manga) => ({
      id: manga.id,
      slug: manga.slug,
      name: manga.name,
      coverUrl: manga.cover_full_url,
      stats: {
        views: manga.views_count || 0,
        ratings: manga.rating_average || 0,
        ratingsCount: manga.rating_count || 0,
        bookmarks: manga.bookmarks_count || 0,
      },
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 4. Initial Data with Placeholder

```tsx
// Use placeholder data for instant UI
export function useMangaListWithPlaceholder(
  filters: FilterValues,
  page: number
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.manga.list(filters, page),
    queryFn: () => mangaApi.getList(buildApiParams(filters, page)),
    initialData: () => {
      // Return cached data from previous page if available
      return queryClient.getQueryData(queryKeys.manga.list(filters, page - 1));
    },
    initialDataUpdatedAt: () => {
      // Use the update time of cached data
      const queryState = queryClient.getQueryState(
        queryKeys.manga.list(filters, page - 1)
      );
      return queryState?.dataUpdatedAt;
    },
    staleTime: 60_000,
  });
}
```

---

## Mutation Patterns

### 1. Optimistic Updates with Rollback

```tsx
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mangaId, isBookmarked }: ToggleBookmarkParams) =>
      bookmarkApi.toggle(mangaId, isBookmarked),

    // Cancel any outgoing refetches
    onMutate: async ({ mangaId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.manga.all });

      // Snapshot previous value
      const previousMangaLists = queryClient.getQueriesData({
        queryKey: queryKeys.manga.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: queryKeys.manga.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((manga: Manga) =>
              manga.id === mangaId
                ? { ...manga, is_bookmarked: !isBookmarked }
                : manga
            ),
          };
        }
      );

      // Update specific manga detail
      queryClient.setQueriesData(
        { queryKey: queryKeys.manga.details() },
        (oldData: any) => {
          if (!oldData || oldData.id !== mangaId) return oldData;
          return { ...oldData, is_bookmarked: !isBookmarked };
        }
      );

      return { previousMangaLists };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousMangaLists) {
        context.previousMangaLists.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manga.all });
    },
  });
}
```

### 2. Sequential Mutations

```tsx
// Chain mutations that depend on each other
export function useAddMangaToLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mangaId, categoryId }: AddToLibraryParams) => {
      // First, add to favorites
      await bookmarkApi.add(mangaId);

      // Then, categorize
      if (categoryId) {
        await libraryApi.categorize(mangaId, categoryId);
      }

      // Finally, update reading progress
      await historyApi.update(mangaId, { last_read: new Date() });

      return { success: true };
    },

    onSuccess: (_, { mangaId }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryKeyHelpers.invalidateManga(queryClient, getMangaSlug(mangaId));
    },
  });
}
```

### 3. Mutation with Progress Tracking

```tsx
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      return userApi.uploadAvatar(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setProgress(percentCompleted);
        },
      });
    },

    onSuccess: (newUser) => {
      // Update user data in cache
      queryClient.setQueryData(["user", "profile"], newUser);
      setProgress(0);
    },

    onError: () => {
      setProgress(0);
    },
  });

  return { ...mutation, progress };
}
```

---

## Prefetching Strategies

### 1. Hover Prefetching

```tsx
// components/manga/manga-card.tsx
export function MangaCard({ manga }: MangaCardProps) {
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    // Delay prefetch to avoid unnecessary requests
    prefetchTimeoutRef.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.manga.detail(manga.slug),
        queryFn: () => mangaApi.getDetail(manga.slug),
        staleTime: 60_000,
      });
    }, 200); // 200ms delay
  };

  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  };

  return (
    <Link
      href={`/manga/${manga.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      prefetch={true} // Next.js route prefetch
    >
      {/* Card content */}
    </Link>
  );
}
```

### 2. Viewport Intersection Prefetching

```tsx
// hooks/use-viewport-prefetch.ts
export function useViewportPrefetch(
  queryKey: unknown[],
  queryFn: () => Promise<unknown>,
  options: {
    rootMargin?: string;
    threshold?: number;
    staleTime?: number;
  } = {}
) {
  const queryClient = useQueryClient();
  const elementRef = useRef<HTMLElement>(null);
  const hasPrefetched = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasPrefetched.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPrefetched.current) {
          queryClient.prefetchQuery({
            queryKey,
            queryFn,
            staleTime: options.staleTime || 60_000,
          });
          hasPrefetched.current = true;
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin || "200px",
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [queryClient, queryKey, queryFn, options]);

  return elementRef;
}
```

### 3. Smart Pagination Prefetching

```tsx
// hooks/use-smart-pagination.ts
export function useSmartPagination<T>(
  queryKey: unknown[],
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>,
  options: {
    prefetchPages?: number;
    prefetchDelay?: number;
  } = {}
) {
  const queryClient = useQueryClient();
  const { data, ...query } = useQuery({
    queryKey,
    queryFn: () => fetchPage(1),
    staleTime: 60_000,
  });

  const currentPage = data?.meta?.pagination?.current_page || 1;
  const totalPages = data?.meta?.pagination?.last_page || 1;

  // Prefetch next pages
  useEffect(() => {
    if (!data || !options.prefetchPages) return;

    const timer = setTimeout(() => {
      const pagesToPrefetch = Math.min(
        options.prefetchPages,
        totalPages - currentPage
      );

      for (let i = 1; i <= pagesToPrefetch; i++) {
        queryClient.prefetchQuery({
          queryKey: [...queryKey, currentPage + i],
          queryFn: () => fetchPage(currentPage + i),
          staleTime: 60_000,
        });
      }
    }, options.prefetchDelay || 1000);

    return () => clearTimeout(timer);
  }, [data, currentPage, totalPages]);

  return { data, ...query };
}
```

---

## Cache Synchronization

### 1. Cross-Query Synchronization

```tsx
// Keep multiple queries in sync
export function useSyncedMangaData(slug: string) {
  const queryClient = useQueryClient();

  // Main manga detail query
  const mangaQuery = useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
    onSuccess: (manga) => {
      // Sync with list queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.manga.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((item: Manga) =>
              item.slug === manga.slug ? { ...item, ...manga } : item
            ),
          };
        }
      );

      // Sync with search results if applicable
      queryClient.setQueriesData(
        {
          queryKey: queryKeys.manga.all,
          predicate: (query) => query.queryKey[1] === "search",
        },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((item: Manga) =>
              item.slug === manga.slug ? { ...item, ...manga } : item
            ),
          };
        }
      );
    },
  });

  return mangaQuery;
}
```

### 2. Background Data Refresh

```tsx
// Keep data fresh without blocking UI
export function useRealtimeData<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options: {
    interval?: number;
    background?: boolean;
  } = {}
) {
  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: options.interval || 60_000, // 1 minute
    refetchIntervalInBackground: options.background || false,
    staleTime: 30_000, // 30 seconds
    notifyOnChangeProps: ["data", "error"], // Only notify on these changes
  });
}
```

### 3. Cache Warmer

```tsx
// Warm up cache on app startup
export function useCacheWarmer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Warm cache with frequently accessed data
    const warmCache = async () => {
      try {
        // Prefetch genres (static data)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.genres.lists(),
          queryFn: () => genreApi.getList(),
          staleTime: 60 * 60 * 1000, // 1 hour
        });

        // Prefetch user data if authenticated
        const user = await getCurrentUser();
        if (user) {
          await queryClient.prefetchQuery({
            queryKey: queryKeys.user.library("favorites", 1),
            queryFn: () => libraryApi.getFavorites(user.id, 1),
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        }
      } catch (error) {
        console.warn("Cache warming failed:", error);
      }
    };

    // Delay to not block initial render
    const timer = setTimeout(warmCache, 2000);
    return () => clearTimeout(timer);
  }, [queryClient]);
}
```

---

## Error Handling

### 1. Global Error Boundary

```tsx
// components/query-error-boundary.tsx
export function QueryErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        if (fallback) {
          return fallback(error, resetErrorBoundary);
        }

        return (
          <div className="p-4 text-center">
            <h2 className="text-lg font-semibold text-destructive">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mt-2">
              {error.message || "Failed to load data"}
            </p>
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        );
      }}
      onReset={() => {
        // Clear all queries on reset
        queryClient.clear();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 2. Retry with Exponential Backoff

```tsx
export function useResilientQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
  } = {}
) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      // Retry up to maxRetries times
      return failureCount < (options.maxRetries || 3);
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    staleTime: 60_000,
  });
}
```

### 3. Error Recovery Strategies

```tsx
export function useQueryWithErrorRecovery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  fallbackData?: T
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey,
    queryFn,
    retry: 1, // Only retry once
    staleTime: 60_000,

    // Return fallback data on error
    select: (data) => data,

    onError: (error) => {
      console.error("Query failed:", error);

      // Try to use stale data if available
      const staleData = queryClient.getQueryData<T>(queryKey);
      if (staleData) {
        queryClient.setQueryData(queryKey, staleData);
      }
    },

    // Use fallback data if provided
    placeholderData: fallbackData,
  });
}
```

---

## Performance Patterns

### 1. Query Debouncing

```tsx
// hooks/use-debounced-query.ts
export function useDebouncedQuery<T>(
  queryKey: unknown[],
  queryFn: (debouncedValue: string) => Promise<T>,
  searchValue: string,
  delay: number = 500
) {
  const [debouncedValue, setDebouncedValue] = useState(searchValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchValue, delay]);

  const queryKeyWithDebounce = useMemo(
    () => [...queryKey, debouncedValue],
    [queryKey, debouncedValue]
  );

  return useQuery({
    queryKey: queryKeyWithDebounce,
    queryFn: () => queryFn(debouncedValue),
    enabled: debouncedValue.length > 0,
    staleTime: 30_000,
  });
}
```

### 2. Query Result Memoization

```tsx
// Memoize expensive query transformations
export function useMemoizedMangaList(filters: FilterValues, page: number) {
  return useQuery({
    queryKey: queryKeys.manga.list(filters, page),
    queryFn: () => mangaApi.getList(buildApiParams(filters, page)),
    select: useCallback((data: MangaListResponse) => {
      // Expensive transformation
      return {
        ...data,
        data: data.data.map((manga) => ({
          ...manga,
          displayName: manga.name.trim(),
          rating: parseFloat(manga.rating_average || "0").toFixed(1),
        })),
      };
    }, []),
    staleTime: 60_000,
  });
}
```

### 3. Query Result Pagination Caching

```tsx
// Cache paginated results efficiently
export function usePaginatedQuery<T>(
  baseQueryKey: unknown[],
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>
) {
  const [pages, setPages] = useState<Record<number, PaginatedResponse<T>>>({});
  const queryClient = useQueryClient();

  const fetchPageWithCache = useCallback(
    async (page: number) => {
      // Check cache first
      if (pages[page]) {
        return pages[page];
      }

      // Fetch and cache
      const result = await fetchPage(page);
      setPages((prev) => ({ ...prev, [page]: result }));

      // Prefetch adjacent pages
      if (page > 1 && !pages[page - 1]) {
        queryClient.prefetchQuery({
          queryKey: [...baseQueryKey, page - 1],
          queryFn: () => fetchPage(page - 1),
        });
      }

      if (!pages[page + 1]) {
        queryClient.prefetchQuery({
          queryKey: [...baseQueryKey, page + 1],
          queryFn: () => fetchPage(page + 1),
        });
      }

      return result;
    },
    [pages, fetchPage, queryClient, baseQueryKey]
  );

  return { fetchPageWithCache, pages };
}
```

---

## Testing Strategies

### 1. Testing Query Hooks

```tsx
// __tests__/hooks/use-manga.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMangaDetail } from "@/hooks/use-manga";

// Mock API
jest.mock("@/lib/api/endpoints/manga", () => ({
  mangaApi: {
    getDetail: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMangaDetail", () => {
  it("should fetch manga detail successfully", async () => {
    const mockManga = { id: 1, slug: "test-manga", name: "Test Manga" };
    (mangaApi.getDetail as jest.Mock).mockResolvedValue(mockManga);

    const { result } = renderHook(() => useMangaDetail("test-manga"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockManga);
    });

    expect(mangaApi.getDetail).toHaveBeenCalledWith("test-manga");
    expect(result.current.error).toBe(null);
  });

  it("should handle fetch error", async () => {
    const error = new Error("Failed to fetch");
    (mangaApi.getDetail as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useMangaDetail("test-manga"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(error);
    });

    expect(result.current.data).toBe(undefined);
  });
});
```

### 2. Testing Mutations

```tsx
// __tests__/hooks/use-toggle-bookmark.test.tsx
describe("useToggleBookmark", () => {
  it("should optimistically update bookmark status", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Setup initial data
    queryClient.setQueryData(queryKeys.manga.list({}, 1), {
      data: [{ id: 1, slug: "test", is_bookmarked: false }],
      meta: { pagination: { current_page: 1, last_page: 1 } },
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    // Execute mutation
    result.current.mutate({ mangaId: 1, isBookmarked: false });

    // Check optimistic update
    const cachedData = queryClient.getQueryData(queryKeys.manga.list({}, 1));
    expect(cachedData.data[0].is_bookmarked).toBe(true);
  });
});
```

### 3. Testing Query Keys

```tsx
// __tests__/query-keys.test.ts
import { queryKeys } from "@/lib/api/query-keys";

describe("queryKeys", () => {
  it("should generate consistent keys", () => {
    const filters = { search: "test", genre: "action" };
    const page = 1;

    const key1 = queryKeys.manga.list(filters, page);
    const key2 = queryKeys.manga.list(filters, page);

    expect(key1).toEqual(key2);
    expect(key1).toEqual([
      "manga",
      "list",
      { filters: { search: "test", genre: "action" }, page: 1 },
    ]);
  });

  it("should handle partial invalidation", () => {
    const allListsKey = queryKeys.manga.lists();
    const specificListKey = queryKeys.manga.list({}, 1);

    expect(specificListKey).toContain(allListsKey[0]);
    expect(specificListKey).toContain(allListsKey[1]);
  });
});
```

---

## Common Pitfalls

### 1. Memory Leaks from Uncancelled Requests

```tsx
// ❌ BAD - Not cancelling requests
export function useBadMangaQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => fetch(`/api/manga/${slug}`).then((r) => r.json()),
    // Query doesn't cancel on unmount
  });
}

// ✅ GOOD - Using AbortController
export function useMangaQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: ({ signal }) =>
      fetch(`/api/manga/${slug}`, { signal }).then((r) => r.json()),
    // React Query automatically passes AbortSignal
  });
}
```

### 2. Over-fetching Data

```tsx
// ❌ BAD - Fetching too much data
useQuery({
  queryKey: ["manga", slug],
  queryFn: () => fetch(`/api/manga/${slug}?include=everything`),
});

// ✅ GOOD - Fetching only what's needed
useQuery({
  queryKey: ["manga", slug],
  queryFn: () => fetch(`/api/manga/${slug}?include=genres,artist`),
});

// Or use field selection
useQuery({
  queryKey: ["manga", slug],
  queryFn: () => fetch(`/api/manga/${slug}?fields=id,name,cover_url`),
});
```

### 3. Incorrect Stale Time Configuration

```tsx
// ❌ BAD - Too short stale time causes excessive refetches
useQuery({
  queryKey: ["genres"],
  queryFn: () => fetchGenres(),
  staleTime: 0, // Refetchs every time
});

// ✅ GOOD - Appropriate stale time for data type
useQuery({
  queryKey: ["genres"],
  queryFn: () => fetchGenres(),
  staleTime: 60 * 60 * 1000, // 1 hour for static data
});
```

### 4. Missing Error Boundaries

```tsx
// ❌ BAD - No error boundary
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MangaList />
    </QueryClientProvider>
  );
}

// ✅ GOOD - With error boundary
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorBoundary>
        <MangaList />
      </QueryErrorBoundary>
    </QueryClientProvider>
  );
}
```

---

## Best Practices Summary

### Do's

1. ✅ Use centralized query key factories with `as const`
2. ✅ Implement optimistic updates with rollback
3. ✅ Prefetch data based on user behavior
4. ✅ Use appropriate stale times for different data types
5. ✅ Implement proper error boundaries
6. ✅ Test queries with mocked data
7. ✅ Use `enabled` option for dependent queries
8. ✅ Cancel requests with AbortSignal
9. ✅ Implement proper cache invalidation strategies
10. ✅ Use select for data transformations

### Don'ts

1. ❌ Don't create query keys dynamically without consistency
2. ❌ Don't forget to handle mutation errors
3. ❌ Don't use the same stale time for all data
4. ❌ Don't over-fetch data you don't need
5. ❌ Don't forget to clean up on unmount
6. ❌ Don't ignore TypeScript in query keys
7. ❌ Don't use `useEffect` for data fetching instead of React Query
8. ❌ Don't forget to test error states
9. ❌ Don't mutate cache data directly without proper patterns
10. ❌ Don't ignore memory usage with infinite queries

---

## Related Guides

- **[State Management](./03-STATE-MANAGEMENT.md)** - React Query fundamentals
- **[Performance Optimization](./10-PERFORMANCE-OPTIMIZATION.md)** - Performance patterns
- **[SSR Implementation](./11-SSR-IMPLEMENTATION.md)** - Server-side rendering

---

## Reference Files

**Good examples:**

- `lib/api/query-keys.ts` - Query key factory implementation
- `hooks/use-browse-manga.ts` - Prefetching pattern
- `hooks/use-toggle-bookmark.ts` - Optimistic updates
- `components/query-error-boundary.tsx` - Error handling
- `__tests__/hooks/` - Testing examples

---

**Last updated**: 2025-12-18 (Phase 02 - Caching & Prefetching Implementation)
