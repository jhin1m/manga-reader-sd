# State Management

**Choosing and implementing the right state management solution**

**Prerequisites:**

- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Understanding Server/Client components

---

## Table of Contents

- [State Management Decision Tree](#state-management-decision-tree)
- [Local State (useState)](#local-state-usestate)
- [Server State (React Query)](#server-state-react-query)
- [Global State (Zustand)](#global-state-zustand)
- [Best Practices](#best-practices)

---

## State Management Decision Tree

**Quick reference for choosing the right solution:**

| State Type           | Solution                  | Use Case                                                   | Example                                       |
| -------------------- | ------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| **Local UI State**   | `useState` / `useReducer` | Form inputs, modals, toggles, component-specific state     | `const [isOpen, setIsOpen] = useState(false)` |
| **Server Data**      | React Query               | API calls, caching, pagination, data fetching              | `useQuery({ queryKey, queryFn })`             |
| **Global App State** | Zustand                   | Auth state, theme, user preferences, cross-component state | `useAuthStore((s) => s.user)`                 |

### Decision Flow

```
What type of state?
│
├─ UI state (modal open, form input, selected tab)?
│  └─ ✅ Use useState or useReducer
│
├─ Data from API/server?
│  └─ ✅ Use React Query (useQuery/useMutation)
│
└─ Shared across many components (auth, theme, settings)?
   └─ ✅ Use Zustand store with persist
```

---

## Local State (useState)

### When to Use

- Form input values
- Modal/dialog open/closed state
- Selected tabs, dropdowns
- Temporary UI state (hover, focus)
- Component-specific state not needed elsewhere

### Basic Usage

```tsx
"use client";

import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search manga..."
      />
    </div>
  );
}
```

### Complex State (useReducer)

For complex state logic with multiple sub-values:

```tsx
import { useReducer } from "react";

interface FilterState {
  genre: string[];
  status: string;
  sortBy: string;
}

type FilterAction =
  | { type: "SET_GENRE"; payload: string[] }
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_SORT"; payload: string }
  | { type: "RESET" };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_GENRE":
      return { ...state, genre: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "RESET":
      return { genre: [], status: "all", sortBy: "name" };
    default:
      return state;
  }
}

export function MangaFilters() {
  const [filters, dispatch] = useReducer(filterReducer, {
    genre: [],
    status: "all",
    sortBy: "name",
  });

  return (
    <div>
      {/* Filter UI */}
      <button onClick={() => dispatch({ type: "RESET" })}>Reset Filters</button>
    </div>
  );
}
```

---

## Server State (React Query)

### When to Use

- Fetching data from APIs
- Caching server responses
- Pagination and infinite scrolling
- Mutations (POST, PUT, DELETE)
- Automatic refetching and background updates

### React Query Configuration

Already configured in `components/providers/react-query-provider.tsx`:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
});
```

### useQuery Pattern

**Basic query:**

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";

export function MangaList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mangas", "recent"],
    queryFn: () => mangaApi.getRecent({ per_page: 12 }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
```

**Query with parameters:**

```tsx
export function MangaDetail({ slug }: { slug: string }) {
  const { data: manga, isLoading } = useQuery({
    queryKey: ["manga", slug],
    queryFn: () => mangaApi.getDetail(slug),
    enabled: !!slug, // Only run if slug exists
  });

  if (isLoading) return <Skeleton />;

  return <div>{manga?.name}</div>;
}
```

**Query with dependencies:**

```tsx
export function ChapterList({ mangaSlug }: { mangaSlug: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["chapters", mangaSlug, page],
    queryFn: () => mangaApi.getChapters(mangaSlug, { page }),
    // Refetch when page changes
  });

  return (
    <div>
      {/* Chapter list */}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

### useMutation Pattern

**For POST, PUT, DELETE operations:**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function BookmarkButton({ mangaId }: { mangaId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => bookmarkApi.add(mangaId),
    onSuccess: () => {
      // Invalidate and refetch bookmarks
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success("Added to bookmarks");
    },
    onError: (error) => {
      toast.error("Failed to bookmark");
    },
  });

  return (
    <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? "Adding..." : "Bookmark"}
    </button>
  );
}
```

**With form data:**

```tsx
export function CommentForm({ mangaId }: { mangaId: number }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (comment: string) =>
      commentApi.create({ manga_id: mangaId, content: comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", mangaId] });
      setContent("");
      toast.success("Comment posted");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
```

### Query Keys Best Practices

Use consistent, hierarchical query keys:

```tsx
// ✅ CORRECT - Hierarchical and consistent
["mangas"][("mangas", "recent")][("mangas", "hot")][("manga", slug)][ // All manga // Recent manga // Hot manga // Single manga detail
  ("manga", slug, "chapters")
][("manga", slug, "chapters", page)][("user", "bookmarks")][ // Manga chapters // Paginated chapters // User bookmarks
  ("user", "history")
][ // User history
  // ❌ WRONG - Inconsistent structure
  "getRecentMangas"
]["mangaDetail-" + slug]["chapters_" + slug + "_" + page];
```

---

## Global State (Zustand)

### When to Use

- Authentication state (user, token)
- Theme preference (dark/light mode)
- User preferences and settings
- State shared across many components
- Persistent state (localStorage)

### Zustand Store Pattern

**Basic store (`lib/store/authStore.ts`):**

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Using Zustand in Components

**Selecting specific state:**

```tsx
"use client";

import { useAuthStore } from "@/lib/store/authStore";

export function UserMenu() {
  // ✅ CORRECT - Select only what you need
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return <LoginButton />;

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Multiple selectors:**

```tsx
export function AuthStatus() {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  return <div>{isAuthenticated ? user?.name : "Guest"}</div>;
}
```

**Calling actions:**

```tsx
export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (credentials) => {
    const response = await authApi.login(credentials);
    setAuth(response.user, response.token);
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Creating Additional Stores

**Theme store example:**

```typescript
// lib/store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark) => set({ isDark }),
    }),
    { name: "theme-storage" }
  )
);
```

---

## Best Practices

### Don't Mix State Types

```tsx
// ❌ WRONG - Storing API data in useState
const [manga, setManga] = useState(null);

useEffect(() => {
  fetchManga().then(setManga);
}, []);

// ✅ CORRECT - Use React Query for API data
const { data: manga } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});
```

### Minimize Re-renders

```tsx
// ❌ WRONG - Selects entire store, causes unnecessary re-renders
const authStore = useAuthStore();

// ✅ CORRECT - Select only what you need
const user = useAuthStore((state) => state.user);
```

### Organize Stores by Domain

```
lib/store/
├── authStore.ts        # Authentication
├── themeStore.ts       # Theme preferences
├── bookmarkStore.ts    # User bookmarks
└── historyStore.ts     # Reading history
```

### Combine with React Query

```tsx
export function MangaBookmarkButton({ mangaId }: { mangaId: number }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const mutation = useMutation({
    mutationFn: () => bookmarkApi.add(mangaId),
    onSuccess: () => {
      toast.success("Bookmarked!");
    },
  });

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <button onClick={() => mutation.mutate()}>Bookmark</button>;
}
```

---

## Common Patterns

### Loading States

```tsx
const { data, isLoading, isFetching } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

if (isLoading) return <Skeleton />;
if (isFetching) return <Spinner />; // Background refetch
```

### Error Handling

```tsx
const { data, error, isError } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: bookmarkApi.add,
  onMutate: async (mangaId) => {
    // Cancel refetch
    await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(["bookmarks"]);

    // Optimistically update
    queryClient.setQueryData(["bookmarks"], (old) => [...old, mangaId]);

    return { previous };
  },
  onError: (err, mangaId, context) => {
    // Rollback on error
    queryClient.setQueryData(["bookmarks"], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
  },
});
```

---

## Related Guides

- **[API Integration](./04-API-INTEGRATION.md)** - Using React Query with API endpoints
- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - When to use client components
- **[Forms & Validation](./05-FORMS-VALIDATION.md)** - Form state management

---

## Reference Files

**Good examples:**

- `lib/store/authStore.ts` - Zustand store with persist
- `lib/hooks/use-auth.ts` - Custom hook using Zustand
- `app/home-content.tsx` - React Query usage
- `components/providers/react-query-provider.tsx` - React Query setup

---

**Last updated**: 2025-11-15
