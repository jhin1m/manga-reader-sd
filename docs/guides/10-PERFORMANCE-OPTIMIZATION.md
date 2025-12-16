# Performance Optimization Guide

**Best practices for optimizing React/Next.js applications for performance**

**Prerequisites:**

- [State Management](./03-STATE-MANAGEMENT.md) - Understanding useState vs useReducer
- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Server/Client components
- [Performance Testing Guide](../performance-testing-guide.md) - How to measure performance

---

## Table of Contents

- [Performance Principles](#performance-principles)
- [Component Optimization](#component-optimization)
- [State Optimization](#state-optimization)
- [Rendering Optimization](#rendering-optimization)
- [Bundle Optimization](#bundle-optimization)
- [Memory Management](#memory-management)
- [Image & Asset Optimization](#image--asset-optimization)
- [Performance Monitoring](#performance-monitoring)

---

## Performance Principles

### 1. Measure First

Never optimize without measuring:
```bash
# Before optimization
npm run dev
# Open Chrome DevTools → Performance tab
# Record baseline performance
```

### 2. Optimize for the User

Focus on metrics that matter:
- **First Contentful Paint (FCP)** - First meaningful content
- **Largest Contentful Paint (LCP)** - Main content visible
- **Time to Interactive (TTI)** - Page becomes responsive
- **Cumulative Layout Shift (CLS)** - Visual stability

### 3. 80/20 Rule

20% of code causes 80% of performance issues. Profile to find bottlenecks.

---

## Component Optimization

### Avoid Unnecessary Re-renders

#### Problem: Multiple useState
```tsx
// ❌ BAD - Multiple useState causing re-renders
function ReaderControls() {
  const [readingMode, setReadingMode] = useState("long-strip");
  const [zoom, setZoom] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [imageSpacing, setImageSpacing] = useState(0);

  // Changing zoom re-renders entire component
  return <div>...</div>;
}
```

#### Solution: useReducer
```tsx
// ✅ GOOD - Consolidated state with useReducer
import { readerReducer, initialState } from "./reader-state-reducer";
import { readerActions } from "./reader-state-actions";

function ReaderControls() {
  const [state, dispatch] = useReducer(readerReducer, initialState);

  // Single state object, one re-render per action
  return <div>...</div>;
}
```

### Memoize Expensive Components

```tsx
// ✅ GOOD - Memoize heavy components
const MangaList = memo(({ mangas }: { mangas: Manga[] }) => {
  return (
    <div>
      {mangas.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
});

// Add comparison function for props
MangaList.displayName = "MangaList";
```

### Memoize Callback Functions

```tsx
// ❌ BAD - New function on every render
function Component() {
  const handleClick = () => {
    // New function instance every render
  };
  return <Button onClick={handleClick}>Click</Button>;
}

// ✅ GOOD - Memoized callback
function Component() {
  const handleClick = useCallback(() => {
    // Same function instance
  }, []); // Empty dependency array

  return <Button onClick={handleClick}>Click</Button>;
}
```

### Memoize Expensive Calculations

```tsx
// ✅ GOOD - Memoize expensive operations
function FilteredList({ items, filter }: { items: Item[]; filter: string }) {
  const filteredItems = useMemo(() => {
    console.log("Filtering items...");
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]); // Only recompute when dependencies change

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## State Optimization

### Lift State Up Strategically

```tsx
// ❌ BAD - Duplicating state
function Parent() {
  const [user, setUser] = useState(null);
  return (
    <>
      <Header user={user} setUser={setUser} />
      <Sidebar user={user} setUser={setUser} />
    </>
  );
}

// ✅ GOOD - Single source of truth
function App() {
  const { user, setUser } = useAuthStore(); // Zustand store
  return (
    <>
      <Header />
      <Sidebar />
    </>
  );
}
```

### Use Derived State

```tsx
// ❌ BAD - Storing derived state
function Component() {
  const [items, setItems] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);

  useEffect(() => {
    setFilteredCount(items.filter(item => item.active).length);
  }, [items]);
}

// ✅ GOOD - Compute on render
function Component() {
  const [items, setItems] = useState([]);

  const filteredCount = items.filter(item => item.active).length;
}
```

### Optimize React Query Usage

```tsx
// ❌ BAD - Unnecessary refetches
const { data } = useQuery({
  queryKey: ["mangas"],
  queryFn: () => mangaApi.getAll(),
  refetchOnWindowFocus: true,
  refetchOnMount: true,
});

// ✅ GOOD - Smart caching
const { data } = useQuery({
  queryKey: ["mangas"],
  queryFn: () => mangaApi.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

---

## Rendering Optimization

### Dynamic Imports for Code Splitting

```tsx
// ✅ GOOD - Lazy load heavy components
import dynamic from "next/dynamic";

const ChapterReaderComments = dynamic(
  () => import("@/components/comments/chapter-reader-comments"),
  {
    loading: () => <CommentsSkeleton />,
    ssr: false, // Don't server render if not needed
  }
);

function ReaderPage() {
  return (
    <div>
      <ReaderContent />
      <ChapterReaderComments /> {/* Loaded on demand */}
    </div>
  );
}
```

### Virtualization for Long Lists

```tsx
// For long lists (1000+ items), use react-window or react-virtualized
import { FixedSizeList as List } from "react-window";

function VirtualizedChapterList({ chapters }: { chapters: Chapter[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ChapterItem chapter={chapters[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={chapters.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Optimizing Images

```tsx
// ✅ GOOD - Next.js Image component with optimization
import Image from "next/image";

function MangaCover({ manga }: { manga: Manga }) {
  return (
    <Image
      src={manga.coverUrl}
      alt={manga.title}
      width={200}
      height={280}
      priority={manga.isFeatured} // Load important images first
      placeholder="blur" // Or "empty"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

---

## Bundle Optimization

### Analyze Bundle Size

```bash
# Analyze webpack bundle
npm run build
npx @next/bundle-analyzer

# Or use webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
ANALYZE=true npm run build
```

### Tree Shaking

```tsx
// ✅ GOOD - Import only what you need
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";

// ❌ BAD - Import entire library
import * as Components from "@/components/ui";
import * as DateFns from "date-fns";
```

### Optimize Third-Party Libraries

```tsx
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    // Reduce bundle size for client
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
    }

    return config;
  },
  transpilePackages: ["some-heavy-package"],
};
```

---

## Memory Management

### Clean Up Effects

```tsx
// ✅ GOOD - Proper cleanup
function useInfiniteScroll(callback: () => void) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);
}
```

### Avoid Memory Leaks

```tsx
// ❌ BAD - Potential memory leak
function Component() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchData().then(response => {
      if (!cancelled) { // Check before state update
        setData(response);
      }
    });

    return () => {
      cancelled = true; // Cancel on unmount
    };
  }, []);
}
```

### Debounce and Throttle

```tsx
// ✅ GOOD - Debounce expensive operations
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery);
    }
  }, [debouncedQuery]);
}
```

---

## Image & Asset Optimization

### Next.js Image Component Best Practices

```tsx
// ✅ GOOD - Optimized image loading
function MangaGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, index) => (
        <div key={src} className="relative aspect-[3/4]">
          <Image
            src={src}
            alt={`Manga page ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={index < 4} // Load first 4 images immediately
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
```

### Lazy Loading for Below-the-Fold Content

```tsx
// ✅ GOOD - Intersection Observer for lazy loading
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="aspect-[3/4] bg-gray-200">
      {isInView ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="animate-pulse bg-gray-300 w-full h-full" />
      )}
    </div>
  );
}
```

---

## Performance Monitoring

### React DevTools Profiler

```tsx
// Wrap components for profiling
import { Profiler } from "react";

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log("Component render:", {
    id,
    phase,
    actualDuration,
    baseDuration,
  });
}

function App() {
  return (
    <Profiler id="ReaderView" onRender={onRenderCallback}>
      <ReaderView />
    </Profiler>
  );
}
```

### Performance Budget

Set and monitor performance budgets:

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@/components/ui"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    minimumCacheTTL: 86400, // 24 hours
    formats: ["image/webp", "image/avif"],
  },
};
```

### Core Web Vitals Monitoring

```tsx
// lib/performance-monitoring.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics
  if (window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_category:
        metric.name === "CLS"
          ? "Web Vitals"
          : "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
}

// pages/_app.tsx
import { reportWebVitals } from "@/lib/performance-monitoring";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Measure Web Vitals
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
              getCLS(reportWebVitals);
              getFID(reportWebVitals);
              getFCP(reportWebVitals);
              getLCP(reportWebVitals);
              getTTFB(reportWebVitals);
            });
          `,
        }}
      />
    </>
  );
}
```

---

## Performance Checklist

### Before Deploying

- [ ] **Bundle Analysis**: Check bundle size with webpack-bundle-analyzer
- [ ] **Lighthouse Score**: Aim for 90+ in all categories
- [ ] **Core Web Vitals**: All metrics in "good" range
- [ ] **Image Optimization**: All images using Next.js Image component
- [ ] **Code Splitting**: Dynamic imports for heavy components
- [ ] **Memoization**: Expensive components and calculations memoized
- [ ] **State Optimization**: No unnecessary re-renders
- [ ] **API Optimization**: React Query caching configured
- [ ] **Memory Leaks**: Effect cleanup implemented
- [ ] **Performance Testing**: Baseline metrics recorded

### Performance Budget Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 250KB (gzipped) for initial load
- **Memory Usage**: < 50MB on average page

### Continuous Monitoring

```typescript
// lib/performance-observer.ts
if (typeof window !== "undefined" && "PerformanceObserver" in window) {
  // Observe long tasks
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration}ms`);
      }
    }
  });

  longTaskObserver.observe({ entryTypes: ["longtask"] });

  // Observe layout shifts
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    }
    console.log(`Cumulative Layout Shift: ${clsScore}`);
  });

  clsObserver.observe({ entryTypes: ["layout-shift"] });
}
```

---

## Related Guides

- **[Performance Testing Guide](../performance-testing-guide.md)** - How to test performance
- **[State Management](./03-STATE-MANAGEMENT.md)** - Optimizing state updates
- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Component performance patterns
- **[Next.js Best Practices](./09-NEXTJS-BEST-PRACTICES.md)** - Next.js specific optimizations

---

## Reference Files

**Good examples:**

- `components/reader/reader-state-reducer.ts` - useReducer pattern for performance
- `lib/utils/comment-cache-utils.ts` - Optimized data transformation utilities
- `components/reader/reader-view.tsx` - Dynamic imports and optimization
- `next.config.js` - Bundle optimization configuration

---

**Last updated**: 2025-12-16 (Phase 04 - Code Quality & Refactoring)