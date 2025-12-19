# Comments System Phase 2: React Query Hooks Documentation

**Complete implementation of React Query hooks for efficient comments data management**

---

## 📋 Overview

This phase implements the data layer for the Comments System using TanStack Query (React Query v5). The hooks provide efficient data fetching, caching, state management, and synchronization with the backend API.

### Phase 2 Deliverables

- ✅ **useComments Hook**: Main hook for manga comments
- ✅ **useChapterComments Hook**: Chapter-specific comments
- ✅ **Optimistic Updates**: Instant UI feedback
- ✅ **Smart Caching**: 5-minute stale time with intelligent invalidation
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error management

---

## 🏗️ Hook Architecture

### File Structure

```
lib/hooks/use-comments.ts
```

### Hook Exports

```typescript
export {
  useComments, // Main manga comments hook
  useChapterComments, // Chapter-specific comments
  commentKeys, // Query keys for cache management
  type UseCommentsParams,
  type UseChapterCommentsParams,
  type CommentsData,
};
```

---

## 🪝 Hook Details

### 1. useMangaComments Hook

**Purpose**: Main hook for fetching and managing manga comments (including unified feeds).

**Signature**:

```typescript
function useMangaComments(
  slug: string,
  params?: UseMangaCommentsParams
): QueryResult<CommentsData>;
```

**Parameters**:

```typescript
interface UseMangaCommentsParams {
  page?: number;
  per_page?: number;
  sort?: "asc" | "desc";
  type?: "all" | "manga" | "chapter"; // Default: "manga"
  enabled?: boolean;
}
```

**Usage (Manga Detail Page - Unified View)**:

```tsx
const { data: comments } = useMangaComments(slug, {
  type: "all", // Fetch both manga and chapter comments
  sort: "desc",
});
```

---

### 2. useChapterComments Hook

**Purpose**: Hook for fetching comments specific to a chapter.

**Signature**:

```typescript
function useChapterComments(
  mangaSlug: string,
  chapterSlug: string,
  params?: UseCommentsParams
): CommentsData;
```

**Usage Example**:

```tsx
function ChapterComments({
  mangaSlug,
  chapterSlug,
}: {
  mangaSlug: string;
  chapterSlug: string;
}) {
  const { comments, isLoading, addComment } = useChapterComments(
    mangaSlug,
    chapterSlug
  );

  return (
    <div>
      <h3>Chapter Discussion</h3>
      <CommentForm onSubmit={addComment} />
      <CommentList comments={comments} />
    </div>
  );
}
```

---

## 🔧 Implementation Details

### Query Keys Structure

Hierarchical query keys for efficient cache management:

```typescript
export const commentKeys = {
  all: ["comments"] as const,
  manga: (slug: string, params?: MangaCommentParams) =>
    [...commentKeys.all, "manga", slug, params] as const,
  chapter: (
    mangaSlug: string,
    chapterSlug: string,
    params?: CommentListParams
  ) => [...commentKeys.all, "chapter", mangaSlug, chapterSlug, params] as const,
};
```

### Data Fetching

```typescript
const { data, isLoading, error, isFetching, isFetchingNextPage } = useQuery({
  queryKey: commentKeys.manga(mangaSlug, { page, per_page, sort }),
  queryFn: () => mangaApi.getComments(mangaSlug, { page, per_page, sort }),
  staleTime: COMMENTS_STALE_TIME, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  enabled: enabled !== false,
  placeholderData: (previousData) => previousData, // Keep previous data while loading
});
```

### Infinite Query Implementation

```typescript
const fetchNextPage = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};
```

### Optimistic Updates

Instant UI feedback for comment submissions:

```typescript
const addCommentMutation = useMutation({
  mutationFn: async (data: CreateCommentRequest) => {
    return mangaApi.addComment(mangaSlug, data);
  },
  onMutate: async (newComment) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({
      queryKey: commentKeys.manga(mangaSlug, { page: 1, per_page, sort }),
    });

    // Snapshot previous value
    const previousComments = queryClient.getQueryData(
      commentKeys.manga(mangaSlug, { page: 1, per_page, sort })
    );

    // Optimistically update to the new value
    queryClient.setQueryData(
      commentKeys.manga(mangaSlug, { page: 1, per_page, sort }),
      (old: PaginatedResponse<Comment> | undefined) => {
        if (!old) return old;

        const optimisticComment: Comment = {
          id: Date.now(), // Temporary ID
          content: newComment.content,
          user: currentUser, // From auth store
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          parent_id: newComment.parent_id,
          replies: [],
          _optimistic: true, // Mark as optimistic
        };

        return {
          ...old,
          data: [optimisticComment, ...old.data],
          meta: {
            ...old.meta,
            total: old.meta.total + 1,
          },
        };
      }
    );

    return { previousComments };
  },
  onError: (err, newComment, context) => {
    // Rollback on error
    if (context?.previousComments) {
      queryClient.setQueryData(
        commentKeys.manga(mangaSlug, { page: 1, per_page, sort }),
        context.previousComments
      );
    }
    toast.error(t("comment.error.failed_to_post"));
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({
      queryKey: commentKeys.manga(mangaSlug),
    });
  },
  onSuccess: () => {
    toast.success(t("comment.success.posted"));
    // Invalidate other related queries
    queryClient.invalidateQueries({
      queryKey: commentKeys.all,
    });
  },
});
```

---

## 🚀 Performance Optimizations

### 1. Smart Caching

- **Stale Time**: 5 minutes for fresh data feel
- **Garbage Collection**: 30 minutes to reclaim memory
- **Background Refetching**: Enabled by default
- **Placeholder Data**: Keeps previous data visible during refetch

### 2. Selective Refetching

Only relevant queries are invalidated:

```typescript
// Invalidate only manga-specific queries
queryClient.invalidateQueries({
  queryKey: commentKeys.manga(mangaSlug),
});

// Don't invalidate other manga comments
```

### 3. Pagination Optimization

- **Infinite Query**: Efficient pagination handling
- **Prefetching**: Next page fetched in advance
- **Deduplication**: Prevents duplicate requests

### 4. Memory Management

```typescript
// Clean up on unmount
useEffect(() => {
  return () => {
    queryClient.removeQueries({
      queryKey: commentKeys.manga(mangaSlug),
    });
  };
}, [mangaSlug]);
```

---

## 🔒 Error Handling

### Global Error Handling

All hooks include comprehensive error handling:

```typescript
// Network errors
if (error instanceof NetworkError) {
  toast.error(t("comment.error.network"));
}

// Validation errors
if (error instanceof ValidationError) {
  toast.error(t("comment.error.validation"));
}

// Rate limiting
if (error instanceof RateLimitError) {
  toast.error(t("comment.error.rate_limit"));
}
```

### Retry Configuration

```typescript
useQuery({
  // ... other options
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry up to 3 times for network errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

---

## 📊 State Management

### Local State

Each hook manages its own local state:

```typescript
const [sort, setSort] = useState<"asc" | "desc">("desc");
```

### Global State Integration

Hooks work seamlessly with Zustand stores:

```typescript
// Get current user from auth store
const { user } = useAuthStore();

// Sync with global UI state
const { addComment: addCommentToStore } = useCommentStore();
```

### Real-time Updates

Ready for WebSocket integration:

```typescript
// Placeholder for future WebSocket integration
useEffect(() => {
  const ws = new WebSocket(WS_URL);

  ws.onmessage = (event) => {
    const newComment = JSON.parse(event.data);
    queryClient.setQueryData(commentKeys.manga(mangaSlug), (old) =>
      updateWithNewComment(old, newComment)
    );
  };

  return () => ws.close();
}, [mangaSlug]);
```

---

## 🧪 Testing

### Testing Utilities

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
```

### Example Test

```typescript
describe("useComments", () => {
  it("fetches comments successfully", async () => {
    const { result } = renderHook(
      () => useComments("test-manga", { page: 1 }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.comments).toHaveLength(20);
    });
  });

  it("handles sorting change", () => {
    const { result } = renderHook(() => useComments("test-manga"), { wrapper });

    act(() => {
      result.current.setSort("asc");
    });

    expect(result.current.sort).toBe("asc");
  });
});
```

---

## 📈 Monitoring & Debugging

### React Query DevTools

Enable in development:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Debug Hooks

```typescript
// Log query state changes
useComments(mangaSlug, {
  onSuccess: (data) => console.log("Comments loaded:", data),
  onError: (error) => console.error("Comments error:", error),
});
```

---

## 🔄 Migration Guide

### From Direct API Calls

**Before**:

```tsx
const [comments, setComments] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchComments = async () => {
    try {
      const data = await mangaApi.getComments(mangaSlug);
      setComments(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchComments();
}, [mangaSlug]);
```

**After**:

```tsx
const { comments, isLoading, error } = useComments(mangaSlug);
```

Benefits:

- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states
- ✅ Pagination support

---

## 📚 Best Practices

### 1. Query Key Design

```typescript
// Good: Specific and hierarchical
commentKeys.manga(mangaSlug, { page, per_page, sort })[
  // Bad: Generic and non-specific
  "comments"
];
```

### 2. Error Boundaries

Wrap components in error boundaries:

```tsx
<ErrorBoundary fallback={<CommentsError />}>
  <CommentsSection mangaSlug={mangaSlug} />
</ErrorBoundary>
```

### 3. Loading States

Provide appropriate loading states:

```tsx
if (isLoading) return <CommentSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

### 4. Prefetching

Prefetch data for better UX:

```tsx
// Prefetch when hovering over a manga link
onMouseEnter={() => {
  queryClient.prefetchQuery({
    queryKey: commentKeys.manga(mangaSlug),
    queryFn: () => mangaApi.getComments(mangaSlug),
  });
}}
```

---

## 🔮 Future Enhancements

### Planned Features

1. **WebSocket Integration**: Real-time comment updates
2. **Offline Support**: Service worker for offline comments
3. **Search Integration**: Hook for comment search
4. **Moderation Hooks**: Hooks for comment moderation
5. **Analytics**: Comment interaction tracking

### Performance Improvements

1. **Virtual Scrolling**: For large comment lists
2. **Selective Sync**: Sync only visible comments
3. **Delta Updates**: Sync only changed comments
4. **Compression**: Compress comment data in transit

---

## 📚 Related Documentation

- [Phase 1: API Layer & Types](./API_DOCUMENTATION.md#comments-system-phase-1-api-layer--types)
- [Phase 3: UI Components](./phase-3-comments-components-documentation.md)
- [React Query Documentation](https://tanstack.com/query/latest)
- [API Integration Guide](./guides/04-API-INTEGRATION.md)

---

**Documentation Version**: 1.0
**Last Updated**: 2025-12-05
**Phase**: 2 of 3
