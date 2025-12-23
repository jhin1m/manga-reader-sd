# Coding Standards

**Code quality rules and conventions for the Manga Reader CMS project**

---

## Naming Conventions

### Files & Directories

| Type              | Convention          | Examples                                            |
| ----------------- | ------------------- | --------------------------------------------------- |
| **Components**    | `kebab-case.tsx`    | `login-form.tsx`, `manga-card.tsx`, `user-menu.tsx` |
| **Pages**         | `page.tsx`          | `app/manga/[slug]/page.tsx`                         |
| **Layouts**       | `layout.tsx`        | `app/layout.tsx`, `app/(auth)/layout.tsx`           |
| **Hooks**         | `use-*.ts`          | `use-auth.ts`, `use-manga.ts`                       |
| **Stores**        | `camelCaseStore.ts` | `authStore.ts`, `themeStore.ts`                     |
| **Types**         | `kebab-case.ts`     | `manga.ts`, `user.ts`, `api.ts`                     |
| **API endpoints** | `kebab-case.ts`     | `lib/api/endpoints/manga.ts`                        |
| **Validators**    | `kebab-case.ts`     | `lib/validators/auth.ts`                            |
| **Utilities**     | `kebab-case.ts`     | `lib/utils.ts`                                      |

### Code Naming

```typescript
// Components: PascalCase
export function MangaCard() {}
export function LoginForm() {}

// Functions/variables: camelCase
const handleClick = () => {};
const searchQuery = "";
const fetchManga = async () => {};

// Constants: UPPER_SNAKE_CASE
const API_URL = "http://localhost:8000";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Types/Interfaces: PascalCase
interface User {}
type AuthResponse = {};
interface MangaCardProps {}
```

---

## TypeScript Best Practices

### 1. Explicit Return Types

```typescript
// ✅ CORRECT - Explicit return type
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export async function fetchManga(slug: string): Promise<Manga> {
  return apiClient.get(`/mangas/${slug}`);
}

// ❌ WRONG - No return type
export function formatNumber(num: number) {
  return num.toLocaleString();
}
```

### 2. Type Inference for Simple Cases

```typescript
// ✅ CORRECT - Type is obvious
const count = 10; // number
const isActive = true; // boolean
const items = ["a", "b"]; // string[]

// ❌ WRONG - Unnecessary explicit types
const count: number = 10;
const isActive: boolean = true;
```

### 3. Use `unknown` Over `any`

```typescript
// ✅ CORRECT - Use unknown and type guard
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error");
  }
}

// ❌ WRONG - Using any
function handleError(error: any) {
  console.error(error.message); // No type safety
}
```

### 4. Type-Only Imports

```typescript
// ✅ CORRECT - Type-only imports
import type { Manga, Chapter } from "@/types/manga";
import type { User, AuthResponse } from "@/types/user";
import type { PaginatedResponse } from "@/types/api";

// ❌ WRONG - Regular imports for types
import { Manga, Chapter } from "@/types/manga";
```

### 5. Avoid `any`

```typescript
// ✅ CORRECT - Proper typing
interface FormData {
  email: string;
  password: string;
}

function handleSubmit(data: FormData) {}

// ❌ WRONG - Using any
function handleSubmit(data: any) {}
```

---

## Export Patterns

### Components

```typescript
// ✅ CORRECT - Named exports
export function MangaCard() {}
export function ChapterList() {}

// Usage
import { MangaCard, ChapterList } from "@/components/manga";
```

### Pages

```typescript
// ✅ CORRECT - Default export (Next.js requirement)
export default function HomePage() {}
export default async function MangaDetailPage() {}
```

### Multiple Related Exports

```typescript
// ✅ CORRECT - Named exports
export function FormHeader() {}
export function FormBody() {}
export function FormFooter() {}

// Usage
import { FormHeader, FormBody } from "@/components/form";
```

---

## Error Handling

### Standard Pattern

```typescript
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (err) {
  const errorMessage =
    err instanceof Error ? err.message : "Unknown error occurred";

  toast.error("Operation failed", {
    description: errorMessage,
  });

  return { success: false, error: errorMessage };
}
```

### Component Error Handling

```tsx
const { data, error, isError } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

if (isError) {
  const message =
    error instanceof Error ? error.message : "Failed to load manga";

  return <ErrorMessage message={message} />;
}
```

---

## Code Comments

### JSDoc for Public APIs

````typescript
/**
 * Fetch manga details by slug
 * @param slug - Manga slug identifier
 * @returns Promise with manga data
 * @throws {Error} When manga is not found
 */
export async function getMangaDetail(slug: string): Promise<Manga> {
  return apiClient.get(`/mangas/${slug}`);
}

/**
 * MangaCard Component
 * Displays manga cover, title, and metadata in a card format
 *
 * @example
 * ```tsx
 * <MangaCard manga={manga} onBookmark={handleBookmark} />
 * ```
 */
export function MangaCard({ manga }: MangaCardProps) {
  // ...
}
````

### Inline Comments - Explain WHY

```typescript
// ✅ GOOD - Explains reasoning
// Using debounce to avoid excessive API calls during typing
const debouncedSearch = useDebounce(searchQuery, 500);

// Fetch on server to enable caching and improve initial load
export async function generateMetadata({ params }) {}

// ❌ BAD - States the obvious
// Set the search query
setSearchQuery(value);

// Loop through mangas
mangas.forEach((manga) => {});
```

### Component Documentation

```tsx
/**
 * LoginForm
 * Handles user authentication with email and password
 * Includes form validation, error handling, and redirect logic
 */
export function LoginForm() {
  // ...
}
```

### NO TODO Comments

```typescript
// ❌ WRONG - TODO comment
// TODO: Add error handling

// ✅ CORRECT - Create GitHub issue instead
// See issue #123: Add error handling for API calls
```

### NO Commented-Out Code

```typescript
// ❌ WRONG
// function oldImplementation() {
//   // Old code...
// }

// ✅ CORRECT - Remove it, use Git history if needed
```

---

## Git Commit Conventions

### Conventional Commits Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Commit Types

| Type        | Description                           | Example                                    |
| ----------- | ------------------------------------- | ------------------------------------------ |
| `feat:`     | New feature                           | `feat: add manga bookmark functionality`   |
| `fix:`      | Bug fix                               | `fix: resolve chapter image loading issue` |
| `refactor:` | Code refactoring (no behavior change) | `refactor: simplify auth state management` |
| `docs:`     | Documentation only                    | `docs: update API integration guide`       |
| `style:`    | Code formatting (no logic change)     | `style: format with prettier`              |
| `test:`     | Adding or updating tests              | `test: add manga search tests`             |
| `chore:`    | Build/tooling changes                 | `chore: update dependencies`               |
| `perf:`     | Performance improvement               | `perf: optimize image loading`             |

### Good Commit Examples

```bash
feat: implement manga search with filters

- Add search bar component
- Integrate search API endpoint
- Add genre and status filters
- Update navigation to include search link

Closes #42
```

```bash
fix: correct chapter navigation on mobile

Fixes issue where next/prev chapter buttons were not
responsive on mobile devices. Updated touch handlers
and improved button sizing.

Fixes #58
```

```bash
refactor: extract manga card component

Split MangaGrid into reusable MangaCard component
for better maintainability and reusability.

No functional changes.
```

### Bad Commit Examples

```bash
# ❌ Too vague
fix: bug

# ❌ No type
Updated the manga page

# ❌ Too many unrelated changes
feat: add search, fix bug, update styles, refactor code
```

---

## File Organization

### Single Responsibility

```typescript
// ✅ CORRECT - Each file has one purpose
// components/manga/manga-card.tsx
export function MangaCard() {}

// components/manga/chapter-list.tsx
export function ChapterList() {}

// ❌ WRONG - Unrelated components in one file
// components/everything.tsx
export function MangaCard() {}
export function UserProfile() {}
export function LoginForm() {}
```

### Separate Type Files When Needed

```typescript
// ✅ CORRECT - Types in separate file when many
// types/manga.ts
export interface Manga {}
export interface Chapter {}
export interface Genre {}

// lib/api/endpoints/manga.ts
import type { Manga } from "@/types/manga";
```

### Reducer Pattern Organization

When using useReducer for complex state:

```typescript
// ✅ CORRECT - Organize reducer pattern files
components/reader/
├── reader-view.tsx              // Main component
├── reader-state-reducer.ts      // Reducer logic and types
├── reader-state-actions.ts      // Action creators
└── reader-state-refactoring-guide.md  // Migration guide

// Reducer file structure
// reader-state-reducer.ts
export interface ReaderState {
  // State interface
}

export type ReaderAction =
  | { type: "ACTION_TYPE"; payload: Type }
  | // ... more actions

export function readerReducer(state: ReaderState, action: ReaderAction): ReaderState {
  // Reducer implementation
}

export const initialState: ReaderState = {
  // Initial state
};
```

---

## Performance Standards

### State Management Performance

#### Choose useState vs useReducer Wisely

```typescript
// ✅ useState for simple, unrelated state
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState(0);

// ✅ useReducer for complex, related state (3+ related values)
// Example: Reader component with 6+ state properties
const [state, dispatch] = useReducer(readerReducer, initialState);
```

#### Memoize Expensive Operations

```typescript
// ✅ Memoize callbacks to prevent unnecessary re-renders
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick]
);

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// ✅ Memoize heavy components
export default memo(ExpensiveComponent);
```

### Component Performance

#### Dynamic Imports for Code Splitting

**Pattern 1: Named Exports (Most common in this project)**

```typescript
// ✅ For components with named exports
import dynamic from "next/dynamic";

const CommentSection = dynamic(
  () =>
    import("@/components/comments/comment-section").then((mod) => ({
      default: mod.CommentSection,
    })),
  {
    loading: () => <CommentsSkeleton />,
    ssr: false,
  }
);
```

**Pattern 2: Default Exports**

```typescript
// ✅ For components with default exports
const HeavyComponent = dynamic(
  () => import("@/components/heavy-component"),
  {
    loading: () => <HeavySkeleton />,
    ssr: false,
  }
);
```

**Why two patterns?** Next.js `dynamic()` expects default exports. Named exports must be transformed via `.then()` callback.

#### Optimize Renders

```typescript
// ✅ Avoid creating new objects/arrays in render
// ❌ BAD
const style = { color: "red", fontSize: "16px" }; // New object each render

// ✅ GOOD
const buttonStyle = useMemo(
  () => ({
    color: "red",
    fontSize: "16px",
  }),
  []
); // Memoized

// ✅ Use stable references for prop objects
const memoizedProps = useMemo(
  () => ({
    id: manga.id,
    title: manga.title,
    onBookmark: handleBookmark,
  }),
  [manga.id, manga.title, handleBookmark]
);
```

### Data Optimization

#### React Query Best Practices

```typescript
// ✅ Configure proper caching
const { data } = useQuery({
  queryKey: queryKeys.manga.list(params, page),
  queryFn: () => mangaApi.getList(buildApiParams(params, page)),
  staleTime: 60_000, // 1 minute
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});

// ✅ Use centralized query keys
import { queryKeys } from "@/lib/api/query-keys";

export const useMangaDetail = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
  });
};
```

---

## React Query Conventions

### Query Key Factory Pattern

Always use centralized query key factories defined in `lib/api/query-keys.ts`:

```typescript
// ✅ CORRECT - Using centralized query keys
import { queryKeys } from "@/lib/api/query-keys";

export function useMangaDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.manga.detail(slug), // Type-safe, consistent
    queryFn: () => mangaApi.getDetail(slug),
  });
}

// ❌ WRONG - Inline query keys
export function useMangaDetail(slug: string) {
  return useQuery({
    queryKey: ["manga", "detail", slug], // Inconsistent, no type safety
    queryFn: () => mangaApi.getDetail(slug),
  });
}
```

### Query Key Structure

Follow hierarchical structure with `as const` for type inference:

```typescript
// lib/api/query-keys.ts
export const queryKeys = {
  // Entity: hierarchical structure
  manga: {
    all: ["manga"] as const,
    lists: () => [...queryKeys.manga.all, "list"] as const,
    list: (filters: FilterValues, page: number) =>
      [...queryKeys.manga.lists(), { filters, page }] as const,
    details: () => [...queryKeys.manga.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.manga.details(), slug] as const,
  },

  // Singular entity: flat structure
  genres: {
    all: ["genres"] as const,
    list: () => [...queryKeys.genres.all, "list"] as const,
  },
} as const;
```

### Stale Time Guidelines

Configure stale times based on data volatility:

| Data Type                   | Stale Time | gcTime     | Reason               |
| --------------------------- | ---------- | ---------- | -------------------- |
| Static (genres, artists)    | 1 hour     | 24 hours   | Rarely changes       |
| Semi-static (manga info)    | 5 minutes  | 30 minutes | Updates occasionally |
| Dynamic (comments, ratings) | 30 seconds | 5 minutes  | Changes frequently   |
| Real-time (notifications)   | 0          | 1 minute   | Always fresh         |

```typescript
// Static data
useQuery({
  queryKey: queryKeys.genres.list(),
  queryFn: () => genreApi.getList(),
  staleTime: 60 * 60 * 1000, // 1 hour
  gcTime: 24 * 60 * 60 * 1000, // 24 hours
});

// Dynamic data
useQuery({
  queryKey: queryKeys.comments.list(mangaSlug, page),
  queryFn: () => commentApi.getList(mangaSlug, page),
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
});
```

### Mutation Patterns

Always implement optimistic updates with rollback:

```typescript
// ✅ CORRECT - Optimistic update with rollback
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mangaId, isBookmarked }) =>
      bookmarkApi.toggle(mangaId, isBookmarked),

    onMutate: async ({ mangaId, isBookmarked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.manga.all });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(
        queryKeys.manga.list(filters, page)
      );

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

      return { previousData };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.manga.list(filters, page),
          context.previousData
        );
      }
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.manga.lists() });
    },
  });
}
```

### Prefetching Patterns

Prefetch data based on user behavior:

```typescript
// Hover prefetching
export function MangaCard({ manga }: MangaCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.manga.detail(manga.slug),
      queryFn: () => mangaApi.getDetail(manga.slug),
      staleTime: 60_000,
    });
  };

  return <Link onMouseEnter={handleMouseEnter}>{/* ... */}</Link>;
}

// Pagination prefetching
export function useBrowseManga(filters: FilterValues, page: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.manga.list(filters, page),
    queryFn: () => mangaApi.getList(buildApiParams(filters, page)),
  });

  // Prefetch next page
  useEffect(() => {
    if (query.data && page < query.data.meta.pagination.last_page) {
      setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.manga.list(filters, page + 1),
          queryFn: () => mangaApi.getList(buildApiParams(filters, page + 1)),
        });
      }, 500);
    }
  }, [query.data, page, filters]);

  return query;
}
```

### Error Handling

Use ErrorBoundary for query errors:

```typescript
// ✅ CORRECT - With error boundary
function MangaPage() {
  return (
    <QueryErrorBoundary fallback={<ErrorComponent />}>
      <MangaContent />
    </QueryErrorBoundary>
  );
}

// ❌ WRONG - No error boundary
function MangaPage() {
  const { data, error } = useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
  });

  if (error) return <div>Error!</div>; // Handled inline
  return <MangaContent manga={data} />;
}
```

### Custom Hooks

Encapsulate query logic in custom hooks:

```typescript
// ✅ CORRECT - Reusable custom hook
export function useMangaDetail(slug: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.manga.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.manga.detail(slug) });
  }, [queryClient, slug]);

  return { ...query, invalidate };
}

// Usage in component
export function MangaDetailPage({ slug }: { slug: string }) {
  const { data: manga, isLoading, error, invalidate } = useMangaDetail(slug);

  // Component logic...
}
```

### Bundle Optimization

#### Import Patterns

```typescript
// ✅ Import only what you need
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// ❌ Avoid importing entire libraries
import * as UI from "@/components/ui";
import * as DateFns from "date-fns";
```

### Image and Asset Optimization

```typescript
// ✅ Always use Next.js Image component
import Image from "next/image";

function MangaCover({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={280}
      priority={false} // Only for above-the-fold images
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

---

## Code Quality Checklist

Before committing:

- [ ] **TypeScript**: No `any` types, explicit return types
- [ ] **Naming**: Follows conventions (PascalCase, camelCase, kebab-case)
- [ ] **Imports**: Type-only imports use `import type`
- [ ] **Comments**: JSDoc for public APIs, explain WHY not WHAT
- [ ] **NO TODOs**: Create GitHub issues instead
- [ ] **NO commented code**: Remove it, use Git
- [ ] **Error handling**: Try-catch where needed
- [ ] **Translations**: All text uses `useTranslations()`
- [ ] **Images**: Use Next.js `<Image>` component, never `<img>` tags
- [ ] **Git commit**: Follows conventional commits format
- [ ] **Performance**: Memoize expensive operations and callbacks
- [ ] **State**: Use useReducer for complex state (3+ related values)
- [ ] **Bundle**: Import only what's needed, use tree shaking
- [ ] **Lazy Loading**: Dynamic imports for heavy components
- [ ] **React Query**: Using centralized query keys from `lib/api/query-keys`
- [ ] **React Query**: Appropriate stale times based on data type
- [ ] **React Query**: Optimistic updates with rollback for mutations
- [ ] **React Query**: Proper error boundaries for query errors

---

## Related References

- **[Checklist](./CHECKLIST.md)** - Pre-commit verification
- **[Anti-Patterns](./ANTI-PATTERNS.md)** - What NOT to do
- **[Examples](./EXAMPLES.md)** - Reference implementations

---

## Related Guides

- **[Project Architecture](../guides/01-PROJECT-ARCHITECTURE.md)** - File structure and organization
- **[Component Patterns](../guides/02-COMPONENT-PATTERNS.md)** - Component conventions

---

**Last updated**: 2025-12-16 (Phase 04 - Performance Standards Added)
