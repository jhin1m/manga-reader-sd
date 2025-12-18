# Server-Side Rendering (SSR) Implementation Guide

**Complete guide to implementing SSR patterns with TanStack Query in Next.js 16 App Router**

**Prerequisites:**

- [State Management](./03-STATE-MANAGEMENT.md) - TanStack Query basics
- [Next.js Best Practices](./09-NEXTJS-BEST-PRACTICES.md) - Next.js fundamentals
- [Performance Optimization](./10-PERFORMANCE-OPTIMIZATION.md) - Performance principles

---

## Table of Contents

- [Overview](#overview)
- [Server-Side QueryClient Factory](#server-side-queryclient-factory)
- [SSR Prefetch Patterns](#ssr-prefetch-patterns)
- [HydrationBoundary Usage](#hydrationboundary-usage)
- [Streaming with Suspense](#streaming-with-suspense)
- [Complete Implementation Example](#complete-implementation-example)
- [Common Patterns](#common-patterns)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)

---

## Overview

Server-side rendering (SSR) with TanStack Query in Next.js 16 App Router provides:

1. **Improved First Contentful Paint (FCP)** - Data is fetched server-side
2. **Better SEO** - Content is present in initial HTML
3. **Enhanced User Experience** - No loading spinners for initial data
4. **Streaming Support** - Progressive rendering with Suspense

### Key Concepts

- **QueryClient Factory**: Creates cached QueryClient instances for server-side use
- **Prefetching**: Populates cache on server before rendering
- **HydrationBoundary**: Transfers server cache to client
- **Suspense**: Enables streaming and progressive loading

---

## Server-Side QueryClient Factory

### The Problem

```tsx
// ❌ BAD - Creating QueryClient without caching
function ServerComponent() {
  const queryClient = new QueryClient(); // New instance every render

  // Causes memory leaks and incorrect behavior
  return (
    <HydrationBoundary client={queryClient}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

### The Solution: React Cache

```tsx
// lib/api/query-client.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Data is considered fresh for 1 minute on server
          staleTime: 60 * 1000,
          // Keep data in memory for 5 minutes
          gcTime: 5 * 60 * 1000,
          // Don't refetch on window focus on server
          refetchOnWindowFocus: false,
          // Prevent retries on server
          retry: false,
        },
      },
    })
);
```

### Why This Works

1. **React cache()**: Ensures the same instance is returned within a single request
2. **Request Isolation**: Each HTTP request gets its own QueryClient
3. **Memory Safety**: Automatic cleanup after request completes
4. **Performance**: Reuses client across multiple components in the same request

### Best Practices for QueryClient Configuration

```tsx
// lib/api/query-client.ts
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Server-specific defaults
          staleTime: 60 * 1000, // 1 minute
          gcTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false, // Server has no window
          retry: false, // Fail fast on server
          refetchOnReconnect: false, // Server doesn't reconnect

          // Client will inherit these but can override
          refetchOnMount: false,
        },
        mutations: {
          retry: false, // Fail fast on server
        },
      },
    })
);
```

---

## SSR Prefetch Patterns

### Basic Prefetch Pattern

```tsx
async function prefetchData(id: string) {
  const queryClient = getQueryClient();

  // Prefetch single query
  await queryClient.prefetchQuery({
    queryKey: ["manga", id],
    queryFn: () => fetchManga(id),
  });

  return dehydrate(queryClient);
}
```

### Parallel Prefetch Pattern

```tsx
// ✅ GOOD - Parallel prefetching
async function prefetchBrowsePage(params: BrowseParams) {
  const queryClient = getQueryClient();

  // Prefetch multiple queries in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["manga-list", params],
      queryFn: () => fetchMangaList(params),
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres"],
      queryFn: () => fetchGenres(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["artists"],
      queryFn: () => fetchArtists(),
    }),
  ]);

  return dehydrate(queryClient);
}
```

### Conditional Prefetch Pattern

```tsx
async function prefetchMangaDetail(slug: string, includeComments: boolean) {
  const queryClient = getQueryClient();

  const prefetchPromises = [
    queryClient.prefetchQuery({
      queryKey: ["manga", slug],
      queryFn: () => fetchManga(slug),
    }),
    queryClient.prefetchQuery({
      queryKey: ["chapters", slug],
      queryFn: () => fetchChapters(slug),
    }),
  ];

  // Conditionally prefetch comments
  if (includeComments) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["comments", slug, 1], // Page 1
        queryFn: () => fetchComments(slug, 1),
      })
    );
  }

  await Promise.all(prefetchPromises);
  return dehydrate(queryClient);
}
```

### Prefetch with Error Handling

```tsx
async function prefetchWithErrorHandling(slug: string) {
  const queryClient = getQueryClient();

  try {
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: ["manga", slug],
        queryFn: async () => {
          const response = await fetchManga(slug);
          if (!response) {
            throw new Error("Manga not found");
          }
          return response;
        },
        retry: 1, // One retry on server
      }),
      queryClient.prefetchQuery({
        queryKey: ["related-manga", slug],
        queryFn: () => fetchRelatedManga(slug),
        retry: 0, // No retry for non-critical data
      }),
    ]);
  } catch (error) {
    // Log error but don't fail the page
    console.error("Prefetch error:", error);
  }

  return dehydrate(queryClient);
}
```

---

## HydrationBoundary Usage

### Basic Hydration

```tsx
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/query-client";

export default async function ServerPage() {
  const queryClient = getQueryClient();

  // Prefetch data
  await queryClient.prefetchQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

### Nested Hydration Boundaries

```tsx
// ✅ GOOD - Separate boundaries for different data concerns
export default function Layout() {
  return (
    <div>
      <HydrationBoundary state={headerState}>
        <Header />
      </HydrationBoundary>

      <HydrationBoundary state={mainState}>
        <MainContent />
      </HydrationBoundary>
    </div>
  );
}
```

### Hydration with Client-Side Updates

```tsx
// Client component that can update the prefetched data
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export function ClientComponent() {
  const queryClient = useQueryClient();

  // This will use the prefetched data initially
  const { data, isLoading } = useQuery({
    queryKey: ["manga-list"],
    queryFn: fetchMangaList,
    // Initial data from server cache
    initialData: queryClient.getQueryData(["manga-list"]),
  });

  // Can update the cache with fresh data
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["manga-list"] });
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      {/* Render data */}
    </div>
  );
}
```

---

## Streaming with Suspense

### Basic Streaming Setup

```tsx
import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function BrowsePage() {
  const dehydratedState = await prefetchBrowseData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<PageSkeleton />}>
        <BrowseContent />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### Granular Streaming

```tsx
// app/(manga)/manga/[slug]/page.tsx
export default async function MangaPage({
  params,
}: {
  params: { slug: string };
}) {
  const dehydratedState = await prefetchMangaData(params.slug);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* Critical content loads first */}
      <Suspense fallback={<MangaInfoSkeleton />}>
        <MangaInfo slug={params.slug} />
      </Suspense>

      {/* Chapter list streams in */}
      <Suspense fallback={<ChapterListSkeleton />}>
        <ChapterList slug={params.slug} />
      </Suspense>

      {/* Comments load last (non-critical) */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsSection slug={params.slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### Progressive Loading with Dynamic Imports

```tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load non-critical components
const CommentsSection = dynamic(
  () => import("@/components/comments/comments-section"),
  {
    loading: () => <CommentsSkeleton />,
    ssr: false, // Don't server render this part
  }
);

export default function MangaPage() {
  return (
    <div>
      <Suspense fallback={<MangaInfoSkeleton />}>
        <MangaInfo />
      </Suspense>

      <Suspense fallback={<ChapterListSkeleton />}>
        <ChapterList />
      </Suspense>

      {/* Loaded on client only */}
      <CommentsSection />
    </div>
  );
}
```

---

## Complete Implementation Example

### Browse Page Implementation

```tsx
// app/(manga)/browse/page.tsx
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/query-client";
import { BrowseContent } from "./browse-content";
import { BrowseSkeleton } from "@/components/browse/browse-skeleton";

interface BrowsePageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    q?: string;
    genre?: string;
  }>;
}

/**
 * Prefetch browse data on server
 * Prefetches manga list and genres for SSR
 */
async function prefetchBrowseData(
  params: Awaited<BrowsePageProps["searchParams"]>
) {
  const queryClient = getQueryClient();

  // Parse filters from search params
  const filters = {
    search: params.q || "",
    status: params.status || "all",
    sort: params.sort || "-updated_at",
    genre: params.genre || "all",
  };
  const page = parseInt(params.page || "1", 10);

  // Build API URL for manga list
  const mangaParams = new URLSearchParams({
    page: String(page),
    per_page: "24",
    sort: filters.sort,
    include: "genres,artist,latest_chapter",
  });

  if (filters.search) {
    mangaParams.set("filter[name]", filters.search);
  }
  if (filters.status && filters.status !== "all") {
    mangaParams.set("filter[status]", filters.status);
  }
  if (filters.genre && filters.genre !== "all") {
    mangaParams.set("filter[id]", filters.genre);
  }

  // Parallel prefetch - manga list + genres
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["manga-list", filters, page],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mangas?${mangaParams.toString()}`
        ).then((r) => {
          if (!r.ok) throw new Error("Failed to fetch manga list");
          return r.json();
        }),
      staleTime: 30 * 1000, // 30 seconds for browse page
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres"],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?per_page=100`).then(
          (r) => {
            if (!r.ok) throw new Error("Failed to fetch genres");
            return r.json();
          }
        ),
      staleTime: 5 * 60 * 1000, // 5 minutes for genres (rarely change)
    }),
  ]);

  return dehydrate(queryClient);
}

/**
 * Browse page - displays manga list with filters and pagination
 * Implements SSR prefetch and streaming with Suspense
 */
export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const dehydratedState = await prefetchBrowseData(params);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<BrowseSkeleton />}>
          <BrowseContent searchParams={params} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
```

### Client Component Implementation

```tsx
// app/(manga)/browse/browse-content.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { MangaGrid } from "@/components/manga/manga-grid";
import { FilterBar } from "@/components/browse/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { mangaApi } from "@/lib/api/endpoints/manga";

export function BrowseContent() {
  const searchParams = useSearchParams();

  // Build filters from URL
  const filters = {
    search: searchParams.get("q") || "",
    status: searchParams.get("status") || "all",
    sort: searchParams.get("sort") || "-updated_at",
    genre: searchParams.get("genre") || "all",
  };
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Use prefetched data if available, otherwise fetch
  const { data: mangaData, isLoading } = useQuery({
    queryKey: ["manga-list", filters, page],
    queryFn: () => mangaApi.getBrowseList(filters, page),
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => mangaApi.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!mangaData || !genresData) {
    return null; // Suspense boundary will show skeleton
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Duyệt Manga</h1>
        <p className="text-muted-foreground">
          Khám phá hàng ngàn bộ manga từ nhiều thể loại khác nhau
        </p>
      </div>

      <FilterBar filters={filters} genres={genresData.data} />

      <MangaGrid mangas={mangaData.data} isLoading={isLoading} />

      {mangaData.meta && (
        <Pagination currentPage={page} totalPages={mangaData.meta.last_page} />
      )}
    </div>
  );
}
```

---

## Common Patterns

### 1. Prefetch Helper Function

```tsx
// lib/api/prefetch-helpers.ts
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "./query-client";

export async function createPrefetchHelper<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options: {
    staleTime?: number;
    retry?: number;
  } = {}
) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime || 60 * 1000,
    retry: options.retry || false,
  });

  return dehydrate(queryClient);
}

export async function prefetchMultiple(
  queries: Array<{
    queryKey: unknown[];
    queryFn: () => Promise<unknown>;
    options?: any;
  }>
) {
  const queryClient = getQueryClient();

  await Promise.all(
    queries.map(({ queryKey, queryFn, options }) =>
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        ...options,
      })
    )
  );

  return dehydrate(queryClient);
}
```

### 2. API Route Pattern with Prefetch

```tsx
// app/api/manga/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQueryClient } from "@/lib/api/query-client";
import { dehydrate } from "@tanstack/react-query";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const queryClient = getQueryClient();

  // Fetch data
  const manga = await queryClient.fetchQuery({
    queryKey: ["manga", params.slug],
    queryFn: () => fetchMangaFromDB(params.slug),
  });

  if (!manga) {
    return NextResponse.json({ error: "Manga not found" }, { status: 404 });
  }

  // Return data with dehydrated cache for potential SSR use
  return NextResponse.json({
    data: manga,
    dehydratedCache: dehydrate(queryClient),
  });
}
```

### 3. Layout-Level Prefetching

```tsx
// app/(manga)/layout.tsx
export default async function MangaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prefetch global data needed by all manga pages
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user-preferences"],
      queryFn: fetchUserPreferences,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ["featured-genres"],
      queryFn: fetchFeaturedGenres,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MangaNavigation />
      <main>{children}</main>
      <MangaFooter />
    </HydrationBoundary>
  );
}
```

### 4. Error Boundary with SSR

```tsx
// app/(manga)/browse/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Browse page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
      <h2 className="text-2xl font-bold mb-4">Unable to load manga</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We encountered an error while loading the manga list. Please try again
        later.
      </p>
      <Button onClick={reset} size="lg">
        Try Again
      </Button>
    </div>
  );
}
```

---

## Performance Considerations

### 1. Cache Strategy

```tsx
// Different stale times based on data type
const prefetchStrategies = {
  // Static data - long cache
  genres: { staleTime: 60 * 60 * 1000 }, // 1 hour

  // Semi-static data - medium cache
  mangaList: { staleTime: 5 * 60 * 1000 }, // 5 minutes

  // Dynamic data - short cache
  comments: { staleTime: 30 * 1000 }, // 30 seconds

  // Real-time data - no cache
  notifications: { staleTime: 0 },
};
```

### 2. Selective Hydration

```tsx
// Only hydrate what's needed
export default function Page() {
  const dehydratedState = await prefetchCriticalData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <CriticalContent />

      {/* Non-critical content fetched client-side */}
      <NonCriticalContent />
    </HydrationBoundary>
  );
}
```

### 3. Memory Management

```tsx
// lib/api/query-client.ts
export const getQueryClient = cache(() => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1000, // Clean up after 5 minutes
        refetchOnMount: false, // Don't refetch immediately
      },
    },
  });

  // Clean up on server request end
  if (typeof window === "undefined") {
    setTimeout(() => {
      client.clear();
    }, 0);
  }

  return client;
});
```

### 4. Bundle Size Impact

```tsx
// next.config.ts
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove server-only code from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "QueryClient already exists" Error

```tsx
// ❌ Problem - Multiple QueryClient instances
const queryClient1 = new QueryClient();
const queryClient2 = getQueryClient(); // Different instance

// ✅ Solution - Use cached client everywhere
const queryClient = getQueryClient(); // Always use the factory
```

#### 2. Hydration Mismatch

```tsx
// ❌ Problem - Different data on server vs client
useQuery({
  queryKey: ["data"],
  queryFn: () => fetch(Date.now()), // Returns different values
});

// ✅ Solution - Ensure deterministic data
useQuery({
  queryKey: ["data"],
  queryFn: () => fetch(), // Consistent data source
  staleTime: 60 * 1000, // Prevent immediate refetch
});
```

#### 3. Memory Leaks on Server

```tsx
// ❌ Problem - Not cleaning up
const queryClient = new QueryClient(); // Never cleaned up

// ✅ Solution - Use React cache
const getQueryClient = cache(() => new QueryClient()); // Auto-cleanup
```

#### 4. Over-fetching

```tsx
// ❌ Problem - Fetching everything
await Promise.all([
  queryClient.prefetchQuery({ queryKey: ["manga"], queryFn: fetchManga }),
  queryClient.prefetchQuery({ queryKey: ["chapters"], queryFn: fetchChapters }),
  queryClient.prefetchQuery({ queryKey: ["comments"], queryFn: fetchComments }),
  queryClient.prefetchQuery({ queryKey: ["related"], queryFn: fetchRelated }),
]);

// ✅ Solution - Fetch what's visible first
await Promise.all([
  queryClient.prefetchQuery({ queryKey: ["manga"], queryFn: fetchManga }),
  queryClient.prefetchQuery({ queryKey: ["chapters"], queryFn: fetchChapters }),
]);
// Defer non-critical data
```

### Debug Tools

```tsx
// lib/api/dev-query-client.ts
export function getDevQueryClient() {
  const queryClient = getQueryClient();

  if (process.env.NODE_ENV === "development") {
    // Log all queries
    queryClient.getQueryCache().subscribe({
      onQueryUpdate: (query) => {
        console.log("Query update:", {
          queryKey: query.queryKey,
          state: query.state,
        });
      },
    });
  }

  return queryClient;
}
```

### Testing SSR Implementation

```tsx
// __tests__/ssr.test.tsx
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import Page from "../app/(manga)/browse/page";

describe("SSR Implementation", () => {
  it("should render with prefetched data", async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ["manga-list"],
      queryFn: () => mockMangaData,
    });

    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Page searchParams={{}} />
        </HydrationBoundary>
      </QueryClientProvider>
    );

    expect(html).toContain("Expected content");
  });
});
```

---

## Migration Checklist

### From Client-Side Only to SSR

- [ ] Create `lib/api/query-client.ts` with cached factory
- [ ] Add prefetch functions for critical data
- [ ] Wrap pages in `HydrationBoundary`
- [ ] Add `Suspense` boundaries with appropriate skeletons
- [ ] Update client components to use prefetched data
- [ ] Add error boundaries for graceful failures
- [ ] Configure stale times appropriately
- [ ] Test with different network conditions
- [ ] Verify SEO improvements
- [ ] Monitor performance metrics

### Performance Metrics to Track

1. **First Contentful Paint (FCP)** - Should improve
2. **Largest Contentful Paint (LCP)** - Should improve
3. **Time to Interactive (TTI)** - Might slightly increase
4. **Cumulative Layout Shift (CLS)** - Should reduce
5. **Bundle Size** - Monitor impact

---

## Related Guides

- **[State Management](./03-STATE-MANAGEMENT.md)** - TanStack Query fundamentals
- **[Performance Optimization](./10-PERFORMANCE-OPTIMIZATION.md)** - Performance principles
- **[Next.js Best Practices](./09-NEXTJS-BEST-PRACTICES.md)** - Next.js patterns

---

## Reference Files

**SSR Implementation Examples:**

- `lib/api/query-client.ts` - Server-side QueryClient factory
- `app/(manga)/browse/page.tsx` - Complete SSR implementation
- `components/browse/browse-skeleton.tsx` - Loading skeleton for SSR
- `app/(manga)/browse/browse-content.tsx` - Client component with prefetched data

---

**Last updated**: 2025-12-18 (Phase 01 - SSR Implementation)
