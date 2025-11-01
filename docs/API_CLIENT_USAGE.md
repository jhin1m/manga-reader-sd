# API Client Usage Guide

Complete guide for using the API Client Infrastructure in the Manga Reader application.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Using API Endpoints](#using-api-endpoints)
4. [TanStack Query Integration](#tanstack-query-integration)
5. [Error Handling](#error-handling)
6. [Type Safety](#type-safety)

---

## Quick Start

### Import API modules

```typescript
import { authApi, mangaApi, chapterApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
```

### Basic usage example

```typescript
// Fetch manga list
const mangas = await mangaApi.getList({ per_page: 20, page: 1 });

// Get manga detail
const manga = await mangaApi.getDetail("one-piece");

// Search mangas
const results = await mangaApi.search({ q: "naruto", per_page: 10 });
```

---

## Authentication

### Login Flow

```typescript
'use client';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // Save auth to store (automatically persists to localStorage)
      setAuth(response.user, response.token);

      // Redirect to homepage
      router.push('/');
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Handle validation errors
        console.error(error.message, error.errors);
      }
    }
  };

  return (/* form JSX */);
}
```

### Register Flow

```typescript
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const handleRegister = async (data: RegisterData) => {
  try {
    const response = await authApi.register(data);

    // Auto-login after registration
    setAuth(response.user, response.token);

    router.push("/");
  } catch (error) {
    // Handle errors
  }
};
```

### Google OAuth

```typescript
import { authApi } from "@/lib/api";

const handleGoogleLogin = async (googleAccessToken: string) => {
  const response = await authApi.googleAuth({
    access_token: googleAccessToken,
  });
  setAuth(response.user, response.token);
};
```

### Logout

```typescript
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const handleLogout = async () => {
  await authApi.logout();

  // Clear local auth state
  useAuthStore.getState().logout();

  router.push("/login");
};
```

### Access User Data

```typescript
import { useAuthStore } from '@/lib/store/authStore';

function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Points: {user.available_points}</p>
    </div>
  );
}
```

---

## Using API Endpoints

### Manga APIs

```typescript
import { mangaApi, genreApi, artistApi } from "@/lib/api";

// Get manga list with filters
const mangas = await mangaApi.getList({
  per_page: 20,
  page: 1,
  sort: "-updated_at",
  "filter[status]": 1, // Ongoing
  "filter[genre_id]": 7, // Action
});

// Get recently updated
const recent = await mangaApi.getRecent({ per_page: 10 });

// Get hot/trending
const hot = await mangaApi.getHot({ per_page: 10 });

// Search
const results = await mangaApi.search({ q: "One Piece", per_page: 20 });

// Get manga details
const manga = await mangaApi.getDetail("one-piece");

// Get chapters for a manga
const chapters = await mangaApi.getChapters("one-piece", {
  per_page: 50,
  sort: "desc",
});

// Get all genres
const genres = await genreApi.getList();

// Get mangas by genre
const actionMangas = await genreApi.getMangas("action", { per_page: 20 });
```

### Chapter APIs

```typescript
import { chapterApi } from "@/lib/api";

// Get chapter details with images
const chapter = await chapterApi.getDetail("chapter-1095");

// Get chapter images (auto-tracks reading history)
const images = await chapterApi.getImages("chapter-1095");

// Track chapter view
await chapterApi.trackView("chapter-1095");

// Get comments
const comments = await chapterApi.getComments("chapter-1095", {
  per_page: 20,
  sort: "desc",
});

// Add comment
const newComment = await chapterApi.addComment("chapter-1095", {
  content: "Great chapter!",
  parent_id: null, // or comment ID to reply
});
```

### User Features

```typescript
import {
  userFavoritesApi,
  userHistoryApi,
  userAchievementsApi,
} from "@/lib/api";

// Get favorites
const favorites = await userFavoritesApi.getList({ per_page: 20 });

// Add to favorites
await userFavoritesApi.add({ manga_id: 42 });

// Remove from favorites
await userFavoritesApi.remove(42);

// Get reading history
const history = await userHistoryApi.getList({ per_page: 20 });

// Get achievements
const achievements = await userAchievementsApi.get();
```

### Comments & Ratings

```typescript
import { commentApi, ratingApi } from "@/lib/api";

// Update comment
await commentApi.update(789, { content: "Updated comment text" });

// Delete comment
await commentApi.delete(789);

// Rate manga
const rating = await ratingApi.rateManga("one-piece", { rating: 4.5 });
```

---

## TanStack Query Integration

### Using with React Query

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mangaApi } from '@/lib/api';

// Fetch manga list
function MangaList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mangas', { page: 1 }],
    queryFn: () => mangaApi.getList({ per_page: 20, page: 1 }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.map((manga) => (
        <div key={manga.id}>{manga.name}</div>
      ))}
    </div>
  );
}

// Fetch manga detail
function MangaDetail({ slug }: { slug: string }) {
  const { data: manga } = useQuery({
    queryKey: ['manga', slug],
    queryFn: () => mangaApi.getDetail(slug),
  });

  return <div>{manga?.name}</div>;
}

// Add to favorites with mutation
function BookmarkButton({ mangaId }: { mangaId: number }) {
  const queryClient = useQueryClient();

  const addFavorite = useMutation({
    mutationFn: () => userFavoritesApi.add({ manga_id: mangaId }),
    onSuccess: () => {
      // Invalidate favorites list to refetch
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return (
    <button onClick={() => addFavorite.mutate()}>
      {addFavorite.isPending ? 'Adding...' : 'Add to Favorites'}
    </button>
  );
}
```

### Custom Hooks

```typescript
// hooks/useMangaList.ts
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api";
import type { MangaListParams } from "@/lib/api";

export function useMangaList(params?: MangaListParams) {
  return useQuery({
    queryKey: ["mangas", params],
    queryFn: () => mangaApi.getList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in component
function HomePage() {
  const { data, isLoading } = useMangaList({ per_page: 20 });

  // ...
}
```

---

## Error Handling

### Using ApiClientError

```typescript
import { ApiClientError } from "@/lib/api";

try {
  await mangaApi.getDetail("invalid-slug");
} catch (error) {
  if (error instanceof ApiClientError) {
    // Access error details
    console.log(error.message); // Error message
    console.log(error.status); // HTTP status code
    console.log(error.errors); // Validation errors (if any)

    // Handle specific errors
    if (error.status === 404) {
      // Manga not found
    } else if (error.status === 422) {
      // Validation errors
      const emailErrors = error.errors?.email;
    }
  }
}
```

### Automatic Error Handling

The API client automatically handles:

- **401 Unauthorized**: Auto-logout and redirect to login
- **Network errors**: Automatic retry with exponential backoff (3 attempts)
- **Timeout**: 30-second timeout for requests
- **Token injection**: Automatic Bearer token from Zustand store

---

## Type Safety

### All responses are fully typed

```typescript
import type { Manga, MangaListItem, Chapter } from "@/lib/api";

// TypeScript knows the exact structure
const manga: Manga = await mangaApi.getDetail("one-piece");
console.log(manga.name); // ✅ string
console.log(manga.status); // ✅ MangaStatus enum
console.log(manga.genres); // ✅ Genre[] | undefined

// List responses include pagination
const response = await mangaApi.getList();
console.log(response.data); // ✅ MangaListItem[]
console.log(response.meta.pagination.total); // ✅ number
```

### Type imports

```typescript
import type {
  // API types
  ApiResponse,
  PaginatedResponse,

  // User types
  User,
  AuthResponse,

  // Manga types
  Manga,
  MangaListItem,
  Genre,
  Artist,

  // Chapter types
  Chapter,
  ChapterListItem,

  // Comment types
  Comment,
  Rating,
} from "@/lib/api";
```

---

## Advanced Features

### Custom Cache Configuration

```typescript
// For static data that rarely changes
const genres = await apiClient.get("/genres", {
  cache: "force-cache",
  next: { revalidate: 3600 }, // Revalidate after 1 hour
});

// For dynamic data that changes frequently
const recentMangas = await apiClient.get("/mangas/recent", {
  cache: "no-store", // Don't cache
});
```

### File Upload (Profile Avatar)

```typescript
import { authApi } from "@/lib/api";

const handleAvatarUpload = async (file: File) => {
  const updatedUser = await authApi.updateProfile({
    avatar: file,
  });

  // Update user in store
  useAuthStore.getState().updateUser(updatedUser);
};
```

### Retry Configuration

The client automatically retries failed requests:

- **Max retries**: 3 attempts
- **Retry delay**: 1s, 2s, 4s (exponential backoff)
- **Retry on**: Network errors, 408, 429, 500, 502, 503, 504
- **Only GET requests** are retried by default

---

## Environment Configuration

Update `.env.local` to change API URL:

```env
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## Complete Example: Manga Detail Page

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { mangaApi, userFavoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

export default function MangaDetailPage({ params }: { params: { slug: string } }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch manga details
  const { data: manga, isLoading } = useQuery({
    queryKey: ['manga', params.slug],
    queryFn: () => mangaApi.getDetail(params.slug),
  });

  // Fetch chapters
  const { data: chaptersResponse } = useQuery({
    queryKey: ['chapters', params.slug],
    queryFn: () => mangaApi.getChapters(params.slug, { per_page: 50 }),
    enabled: !!manga, // Only fetch when manga is loaded
  });

  const handleAddFavorite = async () => {
    if (!manga) return;

    try {
      await userFavoritesApi.add({ manga_id: manga.id });
      // Show success toast
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!manga) return <div>Manga not found</div>;

  return (
    <div>
      <h1>{manga.name}</h1>
      <p>{manga.name_alt}</p>

      <div dangerouslySetInnerHTML={{ __html: manga.pilot }} />

      <div>
        {manga.genres?.map((genre) => (
          <span key={genre.id}>{genre.name}</span>
        ))}
      </div>

      {isAuthenticated && (
        <button onClick={handleAddFavorite}>Add to Favorites</button>
      )}

      <div>
        <h2>Chapters</h2>
        {chaptersResponse?.data.map((chapter) => (
          <div key={chapter.id}>
            <a href={`/manga/${params.slug}/${chapter.slug}`}>
              {chapter.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Token expired or invalid
   - Auto-logout will trigger
   - User needs to login again

2. **CORS Errors**
   - Check backend CORS configuration
   - Ensure `localhost:3000` is whitelisted

3. **Network Timeout**
   - Default timeout is 30 seconds
   - Increase in `lib/api/config.ts` if needed

4. **Type Errors**
   - Ensure all types are imported from `@/lib/api`
   - Check TypeScript version compatibility

---

**Last Updated**: 2025-11-01
**Version**: 1.0.0
