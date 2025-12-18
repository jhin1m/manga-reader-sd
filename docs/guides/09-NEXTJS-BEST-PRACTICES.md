# Next.js Best Practices

**Optimizing Next.js 16 App Router applications**

**Prerequisites:**

- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Server/Client components
- [SSR Implementation](./11-SSR-IMPLEMENTATION.md) - Server-side rendering with TanStack Query

---

## Table of Contents

- [Image Optimization](#image-optimization)
- [Link Component](#link-component)
- [Route Groups](#route-groups)
- [Loading States](#loading-states)
- [Error Handling](#error-handling)
- [Server-Side Rendering](#server-side-rendering)
- [Performance Optimization](#performance-optimization)

---

## Image Optimization

### Always Use Next.js Image Component

**❌ NEVER use native `<img>` tags**

### Basic Usage

```tsx
import Image from "next/image";

// With fixed dimensions
<Image
  src="/logo.png"
  alt="Manga Reader Logo"
  width={200}
  height={50}
  priority // Load immediately (for above-the-fold images)
/>;
```

### Responsive Images with `fill`

```tsx
// For images that fill their container
<div className="relative aspect-[3/4] w-full">
  <Image
    src={manga.cover_full_url}
    alt={manga.name}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover rounded-md"
  />
</div>
```

### The `sizes` Attribute

**Critical for performance** - tells browser how much space image will take:

```tsx
// Single column mobile, 2 columns tablet, 4 columns desktop
sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw";

// Fixed width on all screens
sizes = "300px";

// Full viewport width
sizes = "100vw";
```

### Object Fit

```tsx
// Cover - fills container, may crop
<Image
  fill
  className="object-cover"
/>

// Contain - fits inside container, no cropping
<Image
  fill
  className="object-contain"
/>

// Fill - stretches to fit
<Image
  fill
  className="object-fill"
/>
```

### Priority Loading

Use `priority` for above-the-fold images:

```tsx
// Hero image, manga cover on detail page
<Image
  src={manga.cover_full_url}
  alt={manga.name}
  fill
  priority // Loads immediately, no lazy loading
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Remote Images

Configure in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.example.com",
        pathname: "/uploads/**",
      },
    ],
  },
};
```

### Complete Example with Shimmer Placeholder

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";

export function MangaCover({ manga }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
      <Image
        src={manga.cover_full_url}
        alt={manga.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "object-cover duration-700 ease-in-out",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        placeholder="blur"
        blurDataURL={getShimmerPlaceholder()}
        onLoad={() => setIsLoading(false)}
        priority={manga.isFeatured}
      />
    </div>
  );
}
```

### Image Placeholder Utility

Use the provided shimmer placeholder utility for consistent loading effects:

```tsx
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";

// In your Image component
<Image
  src={src}
  alt={alt}
  placeholder="blur"
  blurDataURL={getShimmerPlaceholder()}
  // ... other props
/>;
```

**Features:**

- Dark blue gradient shimmer matching app theme
- Browser and Node.js compatible
- Base64 encoded for immediate display
- No external dependencies

---

## Link Component

### Always Use Next.js Link

**❌ NEVER use `<a>` tags for internal links**

### Basic Usage

```tsx
import Link from 'next/link'

// Internal link (client-side navigation)
<Link href="/manga/one-piece">
  One Piece
</Link>

// External link (native behavior)
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</Link>
```

### Dynamic Routes

```tsx
<Link href={`/manga/${manga.slug}`}>
  {manga.name}
</Link>

<Link href={`/manga/${manga.slug}/${chapter.slug}`}>
  Chapter {chapter.number}
</Link>
```

### With Query Parameters

```tsx
import Link from "next/link";

<Link
  href={{
    pathname: "/search",
    query: { q: searchQuery, genre: "action" },
  }}
>
  Search Results
</Link>;
// URL: /search?q=naruto&genre=action
```

### Prefetching

Links are automatically prefetched on hover (in production):

```tsx
// Disable prefetching if needed
<Link href="/manga/one-piece" prefetch={false}>
  One Piece
</Link>
```

### Active Link Pattern

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}
```

### Replace vs Push

```tsx
// Default: adds to history (back button works)
<Link href="/manga">Manga</Link>

// Replace: replaces current history entry
<Link href="/login" replace>
  Login
</Link>
```

---

## Route Groups

### Purpose

Organize routes without affecting URLs:

```
app/
├── (auth)/
│   ├── login/page.tsx       → /login
│   └── register/page.tsx    → /register
├── (manga)/
│   ├── page.tsx             → /
│   └── manga/[slug]/page.tsx → /manga/[slug]
└── (user)/
    ├── profile/page.tsx     → /profile
    └── library/page.tsx     → /library
```

### Shared Layouts

Each route group can have its own layout:

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

// app/(manga)/layout.tsx
export default function MangaLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### Benefits

1. **Logical organization** - Group related routes
2. **Different layouts** - Each group can have its own layout
3. **Clean URLs** - No `/auth` or `/manga` prefix in URLs
4. **Better code structure** - Easier to navigate codebase

---

## Loading States

### loading.tsx File

Create `loading.tsx` in any route folder:

```tsx
// app/manga/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Skeleton className="aspect-[3/4] w-full" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
```

### Suspense Boundaries

For granular loading states:

```tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-48" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<MangaGridSkeleton />}>
        <RecentManga />
      </Suspense>

      <Suspense fallback={<MangaGridSkeleton />}>
        <HotManga />
      </Suspense>
    </div>
  );
}
```

---

## Error Handling

### error.tsx File

Create `error.tsx` in route folders:

```tsx
// app/manga/[slug]/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8">
        {error.message || "Failed to load manga"}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### not-found.tsx

Create `not-found.tsx` for 404 errors:

```tsx
// app/manga/[slug]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Manga Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The manga you're looking for doesn't exist
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
```

### Triggering notFound()

```tsx
import { notFound } from "next/navigation";
import { mangaApi } from "@/lib/api/endpoints/manga";

export default async function MangaDetailPage({ params }) {
  try {
    const manga = await mangaApi.getDetail(params.slug);

    if (!manga) {
      notFound(); // Shows not-found.tsx
    }

    return <MangaDetail manga={manga} />;
  } catch (error) {
    throw error; // Shows error.tsx
  }
}
```

---

## Server-Side Rendering

### Overview

Next.js 16 App Router provides powerful server-side rendering capabilities. When combined with TanStack Query, it enables:

- **Data prefetching** on server for instant UI
- **Hydration** of server cache to client
- **Streaming** with Suspense boundaries
- **Progressive loading** of content

**Complete guide**: [SSR Implementation](./11-SSR-IMPLEMENTATION.md)

### Basic SSR Pattern

```tsx
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/query-client";

export default async function Page() {
  const queryClient = getQueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Skeleton />}>
        <ClientComponent />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### QueryClient Factory

Always use the cached QueryClient factory:

```tsx
// lib/api/query-client.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false, // No window on server
          retry: false, // Fail fast
        },
      },
    })
);
```

### Parallel Data Prefetching

Maximize performance with parallel prefetching:

```tsx
async function prefetchPageData() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["manga", slug],
      queryFn: () => fetchManga(slug),
    }),
    queryClient.prefetchQuery({
      queryKey: ["chapters", slug],
      queryFn: () => fetchChapters(slug),
    }),
  ]);

  return dehydrate(queryClient);
}
```

### Streaming with Suspense

Implement progressive loading:

```tsx
export default function Page() {
  return (
    <div>
      {/* Above the fold - loads first */}
      <Suspense fallback={<HeaderSkeleton />}>
        <PageHeader />
      </Suspense>

      {/* Main content - loads second */}
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>

      {/* Below the fold - loads last */}
      <Suspense fallback={<FooterSkeleton />}>
        <PageFooter />
      </Suspense>
    </div>
  );
}
```

### Selective SSR

Not everything needs SSR:

```tsx
// ✅ Good - Strategic SSR
export default function Page() {
  const dehydratedState = await prefetchCriticalData();

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* Critical - SSR */}
      <CriticalContent />
      {/* Non-critical - Client only */}
      <NonCriticalComponent /> {/* Dynamic import */}
    </HydrationBoundary>
  );
}
```

### Common SSR Patterns

1. **Prefetch Helper**

   ```tsx
   export async function prefetchSSR(queryKey, queryFn) {
     const queryClient = getQueryClient();
     await queryClient.prefetchQuery({ queryKey, queryFn });
     return dehydrate(queryClient);
   }
   ```

2. **Error Handling**

   ```tsx
   try {
     await queryClient.prefetchQuery({
       queryKey: ["data"],
       queryFn: fetchData,
       retry: 1, // One retry on server
     });
   } catch (error) {
     console.error("Prefetch failed:", error);
     // Continue rendering with fallback
   }
   ```

3. **Cache Strategy**

   ```tsx
   // Static data - long cache
   prefetchQuery({
     queryKey: ["genres"],
     queryFn: fetchGenres,
     staleTime: 60 * 60 * 1000, // 1 hour
   });

   // Dynamic data - short cache
   prefetchQuery({
     queryKey: ["comments"],
     queryFn: fetchComments,
     staleTime: 30 * 1000, // 30 seconds
   });
   ```

---

## Performance Optimization

### Dynamic Imports

Use dynamic imports to reduce initial bundle size by loading components on-demand.

```tsx
import dynamic from "next/dynamic";

// Lazy load heavy components
const HeavyComponent = dynamic(() => import("@/components/heavy-component"), {
  loading: () => <Skeleton className="h-48" />,
  ssr: false, // Disable SSR for this component
});

// Pattern for components with default export
const ComponentWithDefault = dynamic(
  () =>
    import("@/components/component").then((mod) => ({
      default: mod.Component,
    })),
  {
    loading: () => <ComponentSkeleton />,
  }
);

export function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

### When to Use Dynamic Imports

1. **Below-the-fold content**: Components not visible on initial render
2. **User-triggered UI**: Modals, panels, or settings dialogs
3. **Heavy components**: Components with many dependencies
4. **Client-side only**: Components that don't need SSR

### Package Optimization

Configure Next.js to optimize package imports:

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "@tanstack/react-query",
      "sonner",
    ],
  },
};
```

### Bundle Analysis

Analyze your bundle size to identify optimization opportunities:

```bash
# Generate bundle analysis
ANALYZE=true pnpm build

# Reports are saved to /analyze directory
```

### Replace Heavy Dependencies

Consider using native browser APIs instead of heavy libraries:

```tsx
// ❌ Using date-fns (9.5KB gzipped)
import { formatDistanceToNow } from "date-fns";
const timeAgo = formatDistanceToNow(date);

// ✅ Using native Intl (0KB)
const timeAgo = useMemo(() => {
  const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  const diff = Date.now() - date.getTime();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  // ... calculate relative time
  return rtf.format(-minutes, "minute");
}, [date]);
```

### Font Optimization

```tsx
// app/layout.tsx
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### Metadata Optimization

```tsx
// Static metadata
export const metadata = {
  title: "Manga Reader",
  description: "...",
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const manga = await fetchManga(params.slug);

  return {
    title: manga.name,
    description: manga.description,
  };
}
```

### Parallel Data Fetching

```tsx
// ❌ Sequential (slow)
const manga = await fetchManga(slug);
const chapters = await fetchChapters(slug);
const comments = await fetchComments(slug);

// ✅ Parallel (fast)
const [manga, chapters, comments] = await Promise.all([
  fetchManga(slug),
  fetchChapters(slug),
  fetchComments(slug),
]);
```

### Caching

```tsx
// Cache fetch requests
const manga = await fetch(`/api/manga/${slug}`, {
  next: {
    revalidate: 3600, // Revalidate after 1 hour
  },
});

// No caching (always fresh)
const manga = await fetch(`/api/manga/${slug}`, {
  cache: "no-store",
});
```

---

## Common Patterns

### Manga Card with Next.js Image

```tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function MangaCard({ manga }) {
  return (
    <Link href={`/manga/${manga.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[3/4]">
          <Image
            src={manga.cover_full_url}
            alt={manga.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{manga.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {manga.author}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### Pagination

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
```

---

## Best Practices

1. **Use Next.js Image** - Always for images
2. **Use Next.js Link** - Always for internal navigation
3. **Route Groups** - Organize related routes
4. **Loading States** - Provide feedback during navigation
5. **Error Boundaries** - Handle errors gracefully
6. **Server-Side Rendering** - Prefetch critical data on server
7. **Parallel Fetching** - Load data concurrently
8. **Proper Caching** - Optimize data fetching with appropriate stale times
9. **Font Optimization** - Use Next.js font loader
10. **Dynamic Imports** - Reduce initial bundle size
11. **Package Optimization** - Configure optimizePackageImports
12. **Bundle Analysis** - Regularly analyze bundle size
13. **Native APIs** - Prefer native browser APIs over heavy libraries

---

## Related Guides

- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Server/Client components
- **[SSR Implementation](./11-SSR-IMPLEMENTATION.md)** - Complete SSR patterns
- **[SEO Metadata](./07-SEO-METADATA.md)** - Metadata optimization
- **[UI Components](./08-UI-COMPONENTS.md)** - Component styling

---

## Reference Files

- `lib/api/query-client.ts` - Server-side QueryClient factory
- `app/(manga)/browse/page.tsx` - Complete SSR implementation
- `app/layout.tsx` - Root layout with fonts
- `app/page.tsx` - Homepage with metadata
- `components/manga/manga-card.tsx` - Card with Image and Link

---

**Last updated**: 2025-12-18 (Phase 01 - SSR Implementation)
