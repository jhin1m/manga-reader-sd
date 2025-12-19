# API Integration

**Integrating with the Laravel backend API using React Query**

**Prerequisites:**

- [State Management](./03-STATE-MANAGEMENT.md) - Understanding React Query patterns

---

## Table of Contents

- [API Client Setup](#api-client-setup)
- [Creating API Endpoints](#creating-api-endpoints)
- [Type-Only Imports (MANDATORY)](#type-only-imports-mandatory)
- [Using APIs in Components](#using-apis-in-components)
- [Error Handling](#error-handling)
- [API Endpoints Reference](#api-endpoints-reference)

---

## API Client Setup

### Configuration

API client is configured in `lib/api/client.ts`:

```typescript
import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Logout on 401 Unauthorized
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
```

### Custom Request Options

```typescript
// Skip auth for public endpoints
await apiClient.post("/auth/login", credentials, {
  skipAuth: true,
});
```

---

## Creating API Endpoints

### Endpoint File Structure

Organize endpoints by feature in `lib/api/endpoints/`:

```
lib/api/endpoints/
├── auth.ts        # Authentication endpoints
├── manga.ts       # Manga CRUD operations
├── chapter.ts     # Chapter operations
├── user.ts        # User profile operations
├── comment.ts     # Comments
└── ...
```

### Endpoint File Pattern

**Template (`lib/api/endpoints/feature.ts`):**

```typescript
/**
 * Feature API Endpoints
 * Description of what these endpoints do
 */

import { apiClient } from "../client";
import type {
  Feature,
  FeatureResponse,
  CreateFeatureData,
} from "@/types/feature";
import type { PaginatedResponse, PaginationParams } from "@/types/api";

export const featureApi = {
  /**
   * Get all features with pagination
   * GET /features
   */
  getAll: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Feature>> => {
    return apiClient.get<PaginatedResponse<Feature>>("/features", { params });
  },

  /**
   * Get single feature by slug
   * GET /features/{slug}
   */
  getBySlug: async (slug: string): Promise<Feature> => {
    return apiClient.get<Feature>(`/features/${slug}`);
  },

  /**
   * Create new feature
   * POST /features
   */
  create: async (data: CreateFeatureData): Promise<FeatureResponse> => {
    return apiClient.post<FeatureResponse>("/features", data);
  },

  /**
   * Update feature
   * PUT /features/{id}
   */
  update: async (
    id: number,
    data: Partial<Feature>
  ): Promise<FeatureResponse> => {
    return apiClient.put<FeatureResponse>(`/features/${id}`, data);
  },

  /**
   * Delete feature
   * DELETE /features/{id}
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/features/${id}`);
  },
};
```

### Real Example: Manga API

**`lib/api/endpoints/manga.ts`:**

```typescript
/**
 * Manga API Endpoints
 * All endpoints related to manga operations
 */

import { apiClient } from "../client";
import type { Manga, MangaDetail } from "@/types/manga";
import type { PaginatedResponse, PaginationParams } from "@/types/api";

interface MangaQueryParams extends PaginationParams {
  genre?: string[];
  status?: string;
  sort?: string;
}

export const mangaApi = {
  /**
   * Get all manga with filters and pagination
   * GET /mangas
   */
  getAll: async (
    params?: MangaQueryParams
  ): Promise<PaginatedResponse<Manga>> => {
    return apiClient.get<PaginatedResponse<Manga>>("/mangas", { params });
  },

  /**
   * Get recent manga
   * GET /mangas/recent
   */
  getRecent: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Manga>> => {
    return apiClient.get<PaginatedResponse<Manga>>("/mangas/recent", {
      params,
    });
  },

  /**
   * Get hot/trending manga
   * GET /mangas/hot
   */
  getHot: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Manga>> => {
    return apiClient.get<PaginatedResponse<Manga>>("/mangas/hot", { params });
  },

  /**
   * Get manga detail by slug
   * GET /mangas/{slug}
   */
  getDetail: async (slug: string): Promise<MangaDetail> => {
    return apiClient.get<MangaDetail>(`/mangas/${slug}`);
  },

  /**
   * Search manga
   * GET /mangas/search
   */
  search: async (
    query: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Manga>> => {
    return apiClient.get<PaginatedResponse<Manga>>("/mangas/search", {
      params: { q: query, ...params },
    });
  },

  /**
   * Get manga chapters with pagination and sorting
   * GET /mangas/{slug}/chapters
   */
  getChapters: async (slug: string, params?: PaginationParams) => {
    return apiClient.get(`/mangas/${slug}/chapters`, { params });
  },
};
```

### Real Example: Auth API

**`lib/api/endpoints/auth.ts`:**

```typescript
/**
 * Authentication API Endpoints
 * User authentication and authorization
 */

import { apiClient } from "../client";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  AuthResponse,
} from "@/types/user";

export const authApi = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", credentials, {
      skipAuth: true,
    });
  },

  /**
   * Register new user
   * POST /auth/register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/register", data, {
      skipAuth: true,
    });
  },

  /**
   * Login with Google OAuth
   * POST /auth/google
   */
  googleLogin: async (token: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(
      "/auth/google",
      { token },
      {
        skipAuth: true,
      }
    );
  },

  /**
   * Get authenticated user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/auth/profile");
  },

  /**
   * Update authenticated user profile
   * PUT /auth/profile
   *
   * Supports updating:
   * - name: Display name (optional)
   * - email: Email address (optional, must be unique)
   * - password: New password (optional, requires confirmation)
   * - avatar: Profile image file (optional, max 2MB)
   *
   * Content-Type: multipart/form-data (if avatar), else application/json
   *
   * Returns updated User object
   * Auth store should be synced after successful update
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    // Check if avatar file is included
    if (data.avatar) {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);
      if (data.password_confirmation)
        formData.append("password_confirmation", data.password_confirmation);
      formData.append("avatar", data.avatar);

      return apiClient.putFormData<User>("/auth/profile", formData);
    }

    // No file upload, use JSON
    return apiClient.put<User>("/auth/profile", data);
  },

  /**
   * Logout
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    return apiClient.post("/auth/logout");
  },
};
```

### Password Change Pattern

**Change Password Component:**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";
import type { ChangePasswordData } from "@/types/user";

export function ChangePasswordForm() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordData) => authApi.updateProfile(data),

    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Password changed successfully");
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },

    onError: (error) => {
      toast.error("Failed to change password", {
        description:
          error.response?.data?.message || "Invalid current password",
      });
    },
  });

  const handleSubmit = (data: ChangePasswordData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Current password field */}
      <input
        type="password"
        name="current_password"
        placeholder="Current password"
        required
      />

      {/* New password field */}
      <input
        type="password"
        name="password"
        placeholder="New password"
        required
        minLength={6}
      />

      {/* Confirm password field */}
      <input
        type="password"
        name="password_confirmation"
        placeholder="Confirm new password"
        required
      />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
```

---

## Type-Only Imports (MANDATORY)

### The Rule

**ALL type imports MUST use the `type` keyword**

```typescript
// ✅ CORRECT - Type-only imports
import type { Manga, MangaDetail } from "@/types/manga";
import type { User, AuthResponse } from "@/types/user";
import type { PaginatedResponse, PaginationParams } from "@/types/api";

// ❌ WRONG - Regular imports for types
import { Manga, MangaDetail } from "@/types/manga";
import { User, AuthResponse } from "@/types/user";
```

### Why This Matters

1. **Build optimization**: Type-only imports are removed during compilation
2. **Clear intent**: Shows what's types vs runtime code
3. **Avoid circular dependencies**: Prevents import issues

### Mixing Types and Runtime

```typescript
// ✅ CORRECT - Separate type and runtime imports
import { mangaApi } from "@/lib/api/endpoints/manga"; // Runtime
import type { Manga } from "@/types/manga"; // Type

// ❌ WRONG - Mixed import
import { mangaApi, Manga } from "@/lib/api/endpoints/manga";
```

---

## Using APIs in Components

### Basic Query Pattern

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { MangaCard } from "@/components/manga/manga-card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentManga() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mangas", "recent"],
    queryFn: () => mangaApi.getRecent({ per_page: 12 }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading manga: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
```

### Query with Parameters

```tsx
export function MangaDetail({ slug }: { slug: string }) {
  const { data: manga, isLoading } = useQuery({
    queryKey: ["manga", slug],
    queryFn: () => mangaApi.getDetail(slug),
    enabled: !!slug, // Only fetch if slug exists
  });

  if (isLoading) return <Skeleton />;
  if (!manga) return <div>Manga not found</div>;

  return (
    <div>
      <h1>{manga.name}</h1>
      <p>{manga.description}</p>
    </div>
  );
}
```

### Mutation Pattern

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/authStore";
import type { LoginCredentials } from "@/types/user";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),

    onSuccess: (response) => {
      setAuth(response.user, response.token);
      toast.success("Login successful");
      router.push("/");
    },

    onError: (error) => {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
    },
  });

  const handleSubmit = (data: LoginCredentials) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Pagination Pattern

```tsx
export function MangaList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["mangas", "all", page],
    queryFn: () => mangaApi.getAll({ page, per_page: 20 }),
    keepPreviousData: true, // Keep previous page while loading next
  });

  return (
    <div>
      {/* Manga grid */}

      <div className="pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Previous
        </button>

        <span>
          Page {page} of {data?.last_page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data?.last_page}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Manga Detail Chapter Pagination (Example)

```tsx
// app/(manga)/manga/[slug]/manga-detail-content.tsx
const [chapterPage, setChapterPage] = useState(1);
const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

// Hierarchical query keys include pagination and sort state
const { data: chaptersResponse, isLoading } = useQuery({
  queryKey: ["manga", slug, "chapters", chapterPage, sortOrder],
  queryFn: () =>
    mangaApi.getChapters(slug, {
      page: chapterPage,
      per_page: 50,
      sort: sortOrder === "newest" ? "desc" : "asc", // Server-side sorting
    }),
  enabled: !!manga,
});

// Scroll to top on page change (UX enhancement)
useEffect(() => {
  if (chapterPage > 1) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [chapterPage]);
```

---

## Error Handling

### Component-Level Error Handling

```tsx
const { data, error, isError } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

if (isError) {
  // Type-safe error handling
  const errorMessage =
    error instanceof Error ? error.message : "An error occurred";

  return (
    <div className="error-state">
      <h2>Failed to load manga</h2>
      <p>{errorMessage}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

### Global Error Handling

Already configured in API client interceptors:

```typescript
// Automatic logout on 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);
```

---

## API Endpoints Reference

### Quick Reference

Full API documentation: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

**Base URL:** `http://localhost:8000/api/v1`

### Authentication

| Endpoint         | Method | Description               |
| ---------------- | ------ | ------------------------- |
| `/auth/login`    | POST   | Login with email/password |
| `/auth/register` | POST   | Register new user         |
| `/auth/google`   | POST   | Google OAuth login        |
| `/auth/profile`  | GET    | Get user profile          |
| `/auth/logout`   | POST   | Logout                    |

### Manga

| Endpoint                  | Method | Description               |
| ------------------------- | ------ | ------------------------- |
| `/mangas`                 | GET    | List manga (with filters) |
| `/mangas/recent`          | GET    | Recent manga              |
| `/mangas/hot`             | GET    | Hot/trending manga        |
| `/mangas/search`          | GET    | Search manga              |
| `/mangas/{slug}`          | GET    | Manga details             |
| `/mangas/{slug}/chapters` | GET    | Chapter list              |

### Chapters

| Endpoint                                | Method | Description        |
| --------------------------------------- | ------ | ------------------ |
| `/mangas/{slug}/chapters/{chapterSlug}` | GET    | Chapter content    |
| `/chapters/{id}/view`                   | POST   | Track chapter view |

### User Library

| Endpoint               | Method | Description     |
| ---------------------- | ------ | --------------- |
| `/user/bookmarks`      | GET    | User bookmarks  |
| `/user/bookmarks`      | POST   | Add bookmark    |
| `/user/bookmarks/{id}` | DELETE | Remove bookmark |
| `/user/history`        | GET    | Reading history |

---

## Best Practices

### 1. Consistent Query Keys

```tsx
// ✅ CORRECT - Hierarchical and consistent
["mangas", "recent"][("manga", slug)][("manga", slug, "chapters", page)][
  // ❌ WRONG - Random naming
  "getRecentMangas"
]["mangaDetail-" + slug];
```

### 2. Type Safety

```tsx
// ✅ CORRECT - Fully typed
const { data } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

// data is typed as MangaDetail | undefined
```

### 3. Error Handling

Always handle errors:

```tsx
const { data, error, isError } = useQuery(...)

if (isError) {
  return <ErrorMessage error={error} />
}
```

### 4. Loading States

Provide loading feedback:

```tsx
if (isLoading) {
  return <Skeleton />;
}
```

### 5. Mutation Feedback

```tsx
const mutation = useMutation({
  mutationFn: apiCall,
  onSuccess: () => toast.success("Success!"),
  onError: () => toast.error("Failed!"),
});
```

---

## Related Guides

- **[State Management](./03-STATE-MANAGEMENT.md)** - React Query patterns
- **[Forms & Validation](./05-FORMS-VALIDATION.md)** - Using mutations with forms
- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Client components for API calls

---

## Reference Files

**Good examples:**

- `lib/api/client.ts` - API client setup
- `lib/api/endpoints/auth.ts` - Auth endpoints
- `lib/api/endpoints/manga.ts` - Manga endpoints with query params
- `app/home-content.tsx` - React Query usage in component

---

**Last updated**: 2025-11-15
