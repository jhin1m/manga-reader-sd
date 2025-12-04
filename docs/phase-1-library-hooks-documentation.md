# Phase 1: Library Hooks Documentation

**React Query hooks for user library functionality**

**Implementation Date**: 2025-12-04
**Status**: ✅ Completed

---

## Overview

Phase 1 of the User Library implementation focuses on creating comprehensive React Query hooks for managing user's library data including favorites, reading history, continue reading, and completed manga. These hooks provide a solid foundation for building the library UI with proper caching, pagination, and optimistic updates.

---

## 📁 File Structure

```
lib/hooks/
└── use-library.ts     # All library-related React Query hooks
```

---

## 🔗 API Endpoints Used

The hooks integrate with the following user endpoints:

- **Favorites**: `GET /user/favorites` - Get user's favorite manga list
- **History**: `GET /user/history` - Get user's reading history
- **Remove from History**: `DELETE /user/history/{mangaId}` - Remove manga from history

---

## 🪝 React Query Hooks

### 1. useFavorites

Fetches user's favorite manga with pagination support.

```typescript
import { useFavorites } from "@/lib/hooks/use-library";

const { data, isLoading, error, refetch } = useFavorites({
  page: 1,
  per_page: 20,
  enabled: true, // Optional, defaults to true
});
```

**Parameters**:

- `page` (number): Page number (default: 1)
- `per_page` (number): Items per page (default: 20)
- `enabled` (boolean): Whether to fetch automatically (default: true)

**Returns**:

```typescript
{
  data?: {
    items: FavoriteManga[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### 2. useHistory

Fetches user's reading history with pagination support.

```typescript
import { useHistory } from "@/lib/hooks/use-library";

const { data, isLoading, error } = useHistory({
  page: 1,
  per_page: 20,
});
```

**Parameters**:

- `page` (number): Page number (default: 1)
- `per_page` (number): Items per page (default: 20)
- `enabled` (boolean): Whether to fetch automatically (default: true)

**Returns**: Same structure as `useFavorites` but with `ReadingHistoryItem[]`

### 3. useContinueReading

Fetches the first 5 items from reading history for the "Continue Reading" section.

```typescript
import { useContinueReading } from "@/lib/hooks/use-library";

const { data, isLoading } = useContinueReading();
```

**Returns**:

```typescript
{
  data?: {
    items: ReadingHistoryItem[]; // Max 5 items
    hasMore: boolean; // True if there are more than 5 items
  };
  isLoading: boolean;
}
```

### 4. useCompletedManga

Filters user's favorites to show only completed manga. This is a client-side filter since there's no dedicated API for completed manga.

```typescript
import { useCompletedManga } from "@/lib/hooks/use-library";

const { data, isLoading } = useCompletedManga({
  page: 1,
  per_page: 20,
});
```

**Note**: This hook internally uses `useFavorites` and filters the results based on `manga.status === MangaStatus.COMPLETED`.

### 5. useRemoveFromHistory

Mutation hook to remove manga from reading history.

```typescript
import { useRemoveFromHistory } from "@/lib/hooks/use-library";
import { toast } from "sonner";

const { mutate, isPending } = useRemoveFromHistory();

const handleRemove = (mangaId: number) => {
  mutate(mangaId, {
    onSuccess: () => {
      toast.success("Removed from history");
      // Queries are automatically invalidated and refetched
    },
    onError: () => {
      toast.error("Failed to remove from history");
    },
  });
};
```

**Features**:

- Automatically invalidates history and continue-reading queries on success
- Error handling with console logging
- Loading state via `isPending`

### 6. useLibraryPrefetch

Provides prefetching functions for smooth tab switching experience.

```typescript
import { useLibraryPrefetch } from "@/lib/hooks/use-library";

const { prefetchFavorites, prefetchHistory, prefetchContinueReading } =
  useLibraryPrefetch();

// Prefetch when user hovers over library tab
const handleLibraryHover = () => {
  prefetchFavorites({ page: 1, per_page: 20 });
  prefetchHistory({ page: 1, per_page: 20 });
  prefetchContinueReading();
};
```

**Benefits**:

- Improves user experience by loading data before tab switch
- Uses React Query's prefetch functionality with proper stale time
- No visible loading states when switching tabs

---

## 🔑 Query Keys

All hooks use hierarchical query keys for efficient cache management:

```typescript
export const libraryKeys = {
  all: ["library"] as const,
  favorites: (params?) => [...libraryKeys.all, "favorites", params] as const,
  history: (params?) => [...libraryKeys.all, "history", params] as const,
  continueReading: () => [...libraryKeys.all, "continue-reading"] as const,
};
```

This structure allows:

- Easy invalidation of all library queries: `queryClient.invalidateQueries({ queryKey: libraryKeys.all })`
- Selective invalidation: `queryClient.invalidateQueries({ queryKey: libraryKeys.history() })`
- Automatic refetching on parameter changes

---

## 📊 Cache Configuration

- **Stale Time**: 5 minutes (`1000 * 60 * 5`)
  - Data is considered fresh for 5 minutes
  - Reduces unnecessary API calls
- **Refetch on Window Focus**: Disabled (global React Query setting)
- **Retry**: 1 attempt (global React Query setting)

---

## 🔄 Data Flow

```
Component Layer
       ↓
Custom Hooks (use-library.ts)
       ↓
API Endpoints (lib/api/endpoints/user.ts)
       ↓
Backend API (Laravel)
```

---

## 💡 Usage Examples

### Library Page with Tabs

```typescript
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites, useHistory, useContinueReading, useCompletedManga } from "@/lib/hooks/use-library";
import { MangaGrid } from "@/components/manga/manga-grid";
import { useTranslations } from "next-intl";

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState("continue");
  const t = useTranslations("library");

  const { data: continueData, isLoading: continueLoading } = useContinueReading();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
  const { data: historyData, isLoading: historyLoading } = useHistory();
  const { data: completedData, isLoading: completedLoading } = useCompletedManga();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="continue">{t("tabs.continue")}</TabsTrigger>
        <TabsTrigger value="favorites">{t("tabs.favorites")}</TabsTrigger>
        <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
        <TabsTrigger value="completed">{t("tabs.completed")}</TabsTrigger>
      </TabsList>

      <TabsContent value="continue">
        <MangaGrid
          mangas={continueData?.items || []}
          loading={continueLoading}
        />
      </TabsContent>

      <TabsContent value="favorites">
        <MangaGrid
          mangas={favoritesData?.items || []}
          loading={favoritesLoading}
          pagination={favoritesData?.pagination}
        />
      </TabsContent>

      {/* ... other tabs */}
    </Tabs>
  );
}
```

### History Item with Remove Button

```typescript
"use client";

import { useRemoveFromHistory } from "@/lib/hooks/use-library";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ReadingHistoryItem } from "@/types/chapter";
import { useTranslations } from "next-intl";

interface HistoryItemProps {
  item: ReadingHistoryItem;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const t = useTranslations("library");
  const { mutate, isPending } = useRemoveFromHistory();

  const handleRemove = () => {
    mutate(item.manga.id, {
      onError: () => {
        // Error toast handled by hook
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3>{item.manga.name}</h3>
        <p className="text-sm text-muted-foreground">
          {t("history.lastRead", { date: new Date(item.read_at).toLocaleDateString() })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## 🔍 Error Handling

All hooks include built-in error handling:

1. **Query Errors**: Returned in the `error` property
2. **Mutation Errors**:
   - Logged to console
   - Should be handled by the component (show toast, etc.)
3. **Loading States**:
   - `isLoading` for initial fetch
   - `isPending` for mutations
   - `isFetching` for background refetches

---

## 📱 Performance Optimizations

1. **Prefetching**: Use `useLibraryPrefetch` when user likely to navigate to library
2. **Pagination**: Implement proper pagination for large libraries
3. **Selective Fetching**: Only fetch data when tab is active
4. **Cache Management**: Automatic cache invalidation on mutations

```typescript
// Example: Prefetch on navbar hover
const handleNavbarHover = () => {
  if (!isLibraryPage) {
    const { prefetchFavorites, prefetchHistory } = useLibraryPrefetch();
    prefetchFavorites({ page: 1, per_page: 20 });
    prefetchHistory({ page: 1, per_page: 20 });
  }
};
```

---

## 🧪 Testing Considerations

When testing components using these hooks:

1. **Mock React Query**: Use `@tanstack/react-query` testing utilities
2. **Mock API Responses**: Provide mock data for each hook
3. **Test Loading States**: Verify UI shows loading skeletons
4. **Test Error States**: Verify error handling

```typescript
// Example test setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Test hook
const { result } = renderHook(() => useFavorites(), { wrapper });
```

---

## 🔮 Future Enhancements

1. **Infinite Scroll**: Add `useInfiniteQuery` variants for large datasets
2. **Real-time Updates**: WebSocket integration for live updates
3. **Offline Support**: Cache strategies for offline reading
4. **Advanced Filtering**: Genre, status, rating filters
5. **Search**: Search within user library

---

## 📚 Related Documentation

- **[State Management](./guides/03-STATE-MANAGEMENT.md)** - React Query patterns
- **[API Integration](./guides/04-API-INTEGRATION.md)** - Working with endpoints
- **[Task-to-Docs Mapping](./TASK-TO-DOCS-MAPPING.md)** - "I need to work on user library"
- **[Phase 2 Documentation](./phase-2-validation-schemas-documentation.md)** - Validation schemas for library forms

---

## 📝 Implementation Notes

1. **Type Safety**: All hooks are fully typed with TypeScript
2. **Consistency**: Follows the same patterns as other React Query hooks in the project
3. **Reusability**: Hooks are composable and can be used in various components
4. **Performance**: Optimized with proper caching and prefetching strategies

---

**Phase 1 Status**: ✅ Complete (2025-12-04 17:00 ICT)

**Next Phase**: Phase 2 - Library UI Components and Page Implementation
