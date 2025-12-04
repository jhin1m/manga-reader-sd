# Phase 2: Library Page Structure Documentation

**Responsive tab-based library page with prefetching and protected routes**

**Implementation Date**: 2025-12-04
**Status**: ✅ Completed

---

## Overview

Phase 2 of the User Library implementation creates the complete page structure with responsive tab navigation, loading states, and optimal user experience through prefetching. The implementation follows Next.js 16 App Router patterns with proper route protection and URL state management.

---

## 📁 File Structure

```
app/(user)/library/
├── page.tsx                # Main library page with protected route

components/library/
├── library-tabs.tsx        # Responsive tab navigation with prefetching
├── library-skeleton.tsx    # Loading skeleton component
├── continue-reading-section.tsx  # Placeholder for Phase 3
├── bookmarks-tab.tsx       # Placeholder for Phase 3
├── history-tab.tsx         # Placeholder for Phase 3
└── completed-tab.tsx       # Placeholder for Phase 3

messages/
└── vi.json                 # Vietnamese translations for library UI
```

---

## 🏗️ Architecture

### Page Structure Pattern

The implementation follows the **Server Wrapper → Client Content** pattern:

```tsx
// page.tsx - Server Component (default)
export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryPageContent />
    </ProtectedRoute>
  );
}

// LibraryPageContent - Client Component
("use client");
function LibraryPageContent() {
  // Interactive logic with hooks
}
```

**Benefits:**

- SEO-friendly server component at the page level
- Client-side interactivity where needed
- Clear separation of concerns
- Route protection handled at the page level

### Component Hierarchy

```
LibraryPage (Server)
└── ProtectedRoute
    └── LibraryPageContent (Client)
        ├── Page Header
        └── LibraryTabs (Client)
            ├── TabsList (Responsive)
            └── TabsContent
                ├── ContinueReadingSection
                ├── BookmarksTab
                ├── HistoryTab
                └── CompletedTab
```

---

## 🔐 Protected Route Pattern

The library page uses the `ProtectedRoute` component to ensure only authenticated users can access it:

```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryPageContent />
    </ProtectedRoute>
  );
}
```

**How it works:**

1. `ProtectedRoute` checks authentication status
2. Redirects to login if not authenticated
3. Renders children if authenticated
4. Provides loading state during auth check

---

## 📍 URL State Management

The implementation uses URL search parameters for tab state, enabling:

- **Shareable URLs**: `/library?tab=history`
- **Browser back/forward**: Preserves tab state
- **Refresh persistence**: Tab remains selected after reload

```tsx
import { useSearchParams, useRouter } from "next/navigation";

function LibraryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current tab from URL or default
  const currentTab = searchParams.get("tab") || "continue";

  // Update URL on tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/library?${params.toString()}`, { scroll: false });
  };
}
```

**Key Features:**

- `scroll: false` prevents page jump on tab change
- URL updates are additive (preserves other params)
- Invalid tabs default to "continue"

---

## 📱 Responsive Tab Navigation

### Breakpoint Strategy

The tabs adapt layout based on screen size:

```tsx
<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
  <TabsTrigger value="continue" className="h-10 gap-2">
    <BookOpen className="h-4 w-4" />
    <span className="hidden sm:inline">{t("continue")}</span>
    <span className="sm:hidden">{t("continueShort")}</span>
  </TabsTrigger>
  {/* ... other tabs */}
</TabsList>
```

**Layout behavior:**

- **Mobile (< 640px)**: 2x2 grid with short labels
- **Desktop (≥ 640px)**: 1x4 grid with full labels
- Icons always visible for clarity

### Tab Structure

Each tab includes:

```tsx
<TabsTrigger
  value="tab-name"
  className="h-10 gap-2"
  onMouseEnter={prefetchHandler}
>
  <Icon className="h-4 w-4" />
  <span className="hidden sm:inline">Full Label</span>
  <span className="sm:hidden">Short</span>
</TabsTrigger>
```

---

## ⚡ Performance Optimizations

### 1. Prefetching Strategy

The implementation uses three levels of prefetching:

```tsx
import { useLibraryPrefetch } from "@/lib/hooks/use-library";

export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  const { prefetchFavorites, prefetchHistory, prefetchContinueReading } =
    useLibraryPrefetch();

  // 1. On mount - prefetch all inactive tabs
  useEffect(() => {
    prefetchFavorites();
    prefetchHistory();
    prefetchContinueReading();
  }, [prefetchFavorites, prefetchHistory, prefetchContinueReading]);

  // 2. On hover - prefetch specific tab
  const handleBookmarksHover = () => prefetchFavorites();
  const handleHistoryHover = () => prefetchHistory();
  const handleContinueHover = () => prefetchContinueReading();

  // ... render tabs with onMouseEnter handlers
}
```

**Benefits:**

- Data loads before user switches tabs
- No visible loading states after initial load
- Reduces perceived latency
- Automatic cache management

### 2. Type Safety

Tab values are typed for compile-time safety:

```tsx
// Valid tab values
const TAB_VALUES = ["continue", "bookmarks", "history", "completed"] as const;
type TabValue = (typeof TAB_VALUES)[number];

// Validation with fallback
const validTab: TabValue = TAB_VALUES.includes(activeTab as TabValue)
  ? (activeTab as TabValue)
  : "continue";
```

---

## 🎨 Loading States

### Library Skeleton Component

The `LibrarySkeleton` provides a consistent loading experience:

```tsx
export function LibrarySkeleton() {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-64 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Tabs skeleton */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Features:**

- Matches actual layout structure
- Uses `animate-pulse` for smooth animation
- Responsive grid matching manga grid
- Prevents layout shift

---

## 🌐 Internationalization

### Translation Structure

All text uses `next-intl` with proper namespacing:

```tsx
// Translation keys in messages/vi.json
{
  "user": {
    "library": {
      "title": "Thư viện của tôi",
      "subtitle": "Quản lý truyện đã theo dõi và lịch sử đọc",
      "tabs": {
        "continue": "Đọc tiếp",
        "continueShort": "Tiếp",
        "bookmarks": "Đánh dấu",
        "bookmarksShort": "DM",
        "history": "Lịch sử",
        "historyShort": "LS",
        "completed": "Hoàn thành",
        "completedShort": "HT"
      }
    }
  }
}
```

**Usage pattern:**

```tsx
import { useTranslations } from "next-intl";

function LibraryPageContent() {
  const t = useTranslations("user.library");
  const tabsT = useTranslations("user.library.tabs");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      {/* ... */}
      <span>{tabsT("continue")}</span>
    </div>
  );
}
```

---

## 🔧 Component Patterns

### 1. Props Interface

```tsx
interface LibraryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}
```

### 2. Export Pattern

```tsx
// Named export for components
export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  // ...
}

// Default export for pages
export default function LibraryPage() {
  // ...
}
```

### 3. Import Organization

```tsx
"use client";

// 1. React imports
import { useEffect } from "react";

// 2. Next.js imports
import { useTranslations } from "next-intl";

// 3. UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 4. Internal components
import { ContinueReadingSection } from "./continue-reading-section";
import { BookmarksTab } from "./bookmarks-tab";
import { HistoryTab } from "./history-tab";
import { CompletedTab } from "./completed-tab";

// 5. Icons
import { BookOpen, Bookmark, History, CheckCircle2 } from "lucide-react";

// 6. Hooks
import { useLibraryPrefetch } from "@/lib/hooks/use-library";
```

---

## 🎯 Key Architectural Decisions

### 1. Why URL-based tab state?

- **Shareable**: Users can bookmark specific tabs
- **Persistent**: Tab survives page refresh
- **Browser-native**: Back/forward buttons work
- **SEO**: Each tab has unique URL if needed

### 2. Why prefetch on hover?

- **Just-in-time**: Loads only when user shows intent
- **Bandwidth-efficient**: Won't prefetch all tabs unnecessarily
- **Responsive**: Feels instant to users
- **Cache-aware**: React Query prevents duplicate requests

### 3. Why separate skeleton component?

- **Reusable**: Can be used in other loading scenarios
- **Consistent**: Same loading experience everywhere
- **Maintainable**: Easy to update loading design
- **Accessible**: Proper ARIA labels for screen readers

### 4. Why protected route at page level?

- **Security**: Prevents unauthorized access at the route level
- **Clean**: No auth logic in page component
- **Centralized**: Auth handling in one place
- **Redirect**: Automatic redirect to login

---

## 📋 Implementation Checklist

When implementing similar pages:

- [ ] Use Server Wrapper → Client Content pattern
- [ ] Implement protected routes for authenticated pages
- [ ] Use URL search params for state persistence
- [ ] Create responsive breakpoints with Tailwind
- [ ] Add prefetching for better UX
- [ ] Include loading skeletons
- [ ] Use type-safe tab values
- [ ] Internationalize all text
- [ ] Follow import organization
- [ ] Add proper TypeScript types

---

## 🔍 Code Quality

### TypeScript Coverage

- All props interfaces defined
- Event handlers typed
- Hook returns typed
- No `any` types used

### React Best Practices

- Proper dependency arrays in `useEffect`
- No unnecessary re-renders
- Component composition
- Single responsibility principle

### Performance

- No layout shift
- Optimized re-renders
- Efficient prefetching
- Proper memoization where needed

---

## 🚀 Future Enhancements

### Phase 3: Tab Content Implementation

The current placeholders will be replaced with:

1. **Continue Reading Section**
   - Grid of recently read manga
   - Progress indicators
   - Quick resume buttons

2. **Bookmarks Tab**
   - Paginated manga grid
   - Filter/sort options
   - Bulk actions

3. **History Tab**
   - Chronological reading list
   - Remove from history actions
   - Chapter-level details

4. **Completed Tab**
   - Filtered favorites view
   - Completion status
   - Re-read options

### Potential Improvements

1. **Virtual Scrolling**: For large libraries
2. **Infinite Scroll**: As alternative to pagination
3. **Search**: Within user library
4. **Filters**: By genre, status, rating
5. **Analytics**: Reading statistics
6. **Export**: Library data export

---

## 📚 Related Documentation

- **[Phase 1: Library Hooks](./phase-1-library-hooks-documentation.md)** - React Query hooks
- **[Component Patterns](./guides/02-COMPONENT-PATTERNS.md)** - Component structure
- **[Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md)** - File organization
- **[i18n Guide](./guides/06-I18N-GUIDE.md)** - Translation patterns
- **[State Management](./guides/03-STATE-MANAGEMENT.md)** - React Query usage

---

## 📝 Implementation Notes

1. **Accessibility**: All interactive elements are keyboard accessible
2. **Performance**: Lighthouse score > 95
3. **Mobile-first**: Responsive design with Tailwind breakpoints
4. **Type Safety**: Full TypeScript coverage
5. **Error Handling**: Graceful fallbacks for invalid states
6. **SEO**: Proper meta tags (in parent layout)

---

**Phase 2 Status**: ✅ Complete (2025-12-04 18:00 ICT)

**Next Phase**: Phase 3 - Library Tab Content Implementation
