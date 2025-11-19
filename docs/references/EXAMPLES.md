# Reference Examples

**Good files to study for learning project patterns**

---

## ✅ Components

### `app/home-content.tsx`

**What it demonstrates:**

- ✅ Correct i18n usage with `useTranslations()`
- ✅ Multiple namespaces (`homepage`, `navigation`)
- ✅ Client component pattern
- ✅ React Query usage
- ✅ Component structure

**Key patterns:**

```tsx
const t = useTranslations("homepage");
const tNav = useTranslations("navigation");

const { data, isLoading } = useQuery({
  queryKey: ["mangas", "recent"],
  queryFn: () => mangaApi.getRecent(),
});
```

**Learn from this:**

- How to use translations properly
- Multiple namespace pattern
- React Query integration

**Related guides:**

- [i18n Guide](../guides/06-I18N-GUIDE.md)
- [Component Patterns](../guides/02-COMPONENT-PATTERNS.md)
- [State Management](../guides/03-STATE-MANAGEMENT.md)

---

### `app/page.tsx`

**What it demonstrates:**

- ✅ Server/Client component split
- ✅ SEO metadata usage
- ✅ JSON-LD schema implementation
- ✅ Page structure

**Key patterns:**

```tsx
// Server component
export const metadata = defaultMetadata

export default function HomePage() {
  const schema = generateWebsiteSchema()

  return (
    <>
      <script type="application/ld+json" ... />
      <HomePageContent />
    </>
  )
}
```

**Learn from this:**

- Server component for SEO
- Delegating to client components
- Metadata and JSON-LD schemas

**Related guides:**

- [Component Patterns](../guides/02-COMPONENT-PATTERNS.md)
- [SEO Metadata](../guides/07-SEO-METADATA.md)

---

### `components/auth/protected-route.tsx`

**What it demonstrates:**

- ✅ Route protection pattern
- ✅ Zustand store usage
- ✅ Client component with auth logic

**Key patterns:**

```tsx
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

if (!isAuthenticated) {
  redirect("/login");
}
```

**Learn from this:**

- Auth state management
- Protected route pattern
- Zustand selector usage

**Related guides:**

- [State Management](../guides/03-STATE-MANAGEMENT.md)

---

## ✅ API Integration

### `lib/api/client.ts`

**What it demonstrates:**

- ✅ Axios instance configuration
- ✅ Request/response interceptors
- ✅ Auth token injection
- ✅ Error handling

**Key patterns:**

```tsx
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Learn from this:**

- API client setup
- Interceptor patterns
- Token management

**Related guides:**

- [API Integration](../guides/04-API-INTEGRATION.md)

---

### `lib/api/endpoints/auth.ts`

**What it demonstrates:**

- ✅ API endpoint organization
- ✅ Type-only imports
- ✅ JSDoc comments
- ✅ Public endpoint handling (skipAuth)

**Key patterns:**

```tsx
import type { User, LoginCredentials, AuthResponse } from "@/types/user";

export const authApi = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post("/auth/login", credentials, { skipAuth: true });
  },
};
```

**Learn from this:**

- Endpoint file structure
- Type-only imports pattern
- JSDoc documentation
- Skip auth for public endpoints

**Related guides:**

- [API Integration](../guides/04-API-INTEGRATION.md)
- [Coding Standards](./CODING-STANDARDS.md)

---

### `lib/api/endpoints/manga.ts`

**What it demonstrates:**

- ✅ Endpoints with query parameters
- ✅ Pagination handling
- ✅ Filtering patterns
- ✅ Complex API calls

**Key patterns:**

```tsx
interface MangaQueryParams extends PaginationParams {
  genre?: string[];
  status?: string;
  sort?: string;
}

getAll: async (
  params?: MangaQueryParams
): Promise<PaginatedResponse<Manga>> => {
  return apiClient.get("/mangas", { params });
};
```

**Learn from this:**

- Query parameter handling
- Pagination patterns
- Type-safe API calls

**Related guides:**

- [API Integration](../guides/04-API-INTEGRATION.md)

---

## ✅ State Management

### `lib/store/authStore.ts`

**What it demonstrates:**

- ✅ Zustand store with persist
- ✅ TypeScript typing
- ✅ State and actions separation
- ✅ localStorage persistence

**Key patterns:**

```tsx
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (user: User, token: string) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({ ... }),
    { name: 'auth-storage', storage: createJSONStorage(() => localStorage) }
  )
)
```

**Learn from this:**

- Zustand store pattern
- Persist middleware
- TypeScript typing for stores
- State/actions separation

**Related guides:**

- [State Management](../guides/03-STATE-MANAGEMENT.md)

---

### `lib/hooks/use-auth.ts`

**What it demonstrates:**

- ✅ Custom hook pattern
- ✅ Zustand integration
- ✅ Derived state
- ✅ Action wrappers

**Key patterns:**

```tsx
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return { user, token, isAuthenticated, setAuth, logout };
}
```

**Learn from this:**

- Custom hook pattern
- Abstracting store access
- Providing clean API

**Related guides:**

- [State Management](../guides/03-STATE-MANAGEMENT.md)

---

## ✅ Validation

### `lib/validators/auth.ts`

**What it demonstrates:**

- ✅ Zod schema definitions
- ✅ Type inference
- ✅ Complex validation rules
- ✅ Password confirmation

**Key patterns:**

```tsx
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    // ...
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

**Learn from this:**

- Zod schema patterns
- Type inference with `z.infer`
- Custom refinements
- Validation messages

**Related guides:**

- [Forms & Validation](../guides/05-FORMS-VALIDATION.md)

---

## ✅ SEO Configuration

### `lib/seo/config.ts`

**What it demonstrates:**

- ✅ Centralized SEO configuration
- ✅ Site-wide metadata
- ✅ Open Graph configuration
- ✅ Twitter card setup

**Key patterns:**

```tsx
export const siteConfig = {
  name: "Manga Reader CMS",
  description: "...",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  locale: "vi_VN",
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  // ...
};
```

**Learn from this:**

- SEO configuration structure
- Title template pattern
- Open Graph setup
- Environment variable usage

**Related guides:**

- [SEO Metadata](../guides/07-SEO-METADATA.md)

---

### `lib/seo/metadata.ts`

**What it demonstrates:**

- ✅ Metadata generator functions
- ✅ Dynamic metadata
- ✅ Type-safe metadata generation

**Key patterns:**

```tsx
export function generateMangaMetadata(manga: Manga): Metadata {
  const title = `${manga.name} - Đọc truyện tranh online`
  const description = manga.description?.slice(0, 160) || ...

  return {
    title,
    description,
    openGraph: { ... },
    twitter: { ... }
  }
}
```

**Learn from this:**

- Metadata generator pattern
- Dynamic SEO
- Description truncation
- Fallback values

**Related guides:**

- [SEO Metadata](../guides/07-SEO-METADATA.md)

---

### `lib/seo/json-ld.ts`

**What it demonstrates:**

- ✅ JSON-LD schema generation
- ✅ Structured data patterns
- ✅ Schema.org types

**Key patterns:**

```tsx
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: { ... }
  }
}

export function generateMangaSchema(manga: Manga) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: manga.name,
    author: { '@type': 'Person', name: manga.author },
    // ...
  }
}
```

**Learn from this:**

- JSON-LD schema structure
- Schema.org types
- Structured data patterns

**Related guides:**

- [SEO Metadata](../guides/07-SEO-METADATA.md)

---

## ✅ Utilities

### `lib/utils.ts`

**What it demonstrates:**

- ✅ Utility functions organization
- ✅ `cn()` utility for Tailwind
- ✅ Helper function patterns

**Key patterns:**

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
```

**Learn from this:**

- Utility organization
- `cn()` implementation
- Number formatting
- Explicit return types

**Related guides:**

- [Coding Standards](./CODING-STANDARDS.md)

---

## Quick Reference by Topic

### When you need to...

**Implement authentication:**

- `lib/api/endpoints/auth.ts` - API calls
- `lib/store/authStore.ts` - State management
- `lib/hooks/use-auth.ts` - Custom hook
- `components/auth/protected-route.tsx` - Route protection

**Work with forms:**

- `lib/validators/auth.ts` - Zod schemas

**Add i18n to components:**

- `app/home-content.tsx` - Translation usage

**Implement SEO:**

- `lib/seo/config.ts` - Configuration
- `lib/seo/metadata.ts` - Generators
- `lib/seo/json-ld.ts` - Schemas
- `app/page.tsx` - Usage example

**Integrate APIs:**

- `lib/api/client.ts` - Client setup
- `lib/api/endpoints/manga.ts` - Endpoint patterns

**Manage state:**

- `lib/store/authStore.ts` - Zustand pattern
- `lib/hooks/use-auth.ts` - Custom hook

---

## Related References

- **[Anti-Patterns](./ANTI-PATTERNS.md)** - Files to avoid copying
- **[Checklist](./CHECKLIST.md)** - Verification before commit
- **[Coding Standards](./CODING-STANDARDS.md)** - Conventions to follow

---

## Related Guides

All guides in `/docs/guides/` provide detailed explanations of patterns shown in these examples.

---

**Last updated**: 2025-11-15
