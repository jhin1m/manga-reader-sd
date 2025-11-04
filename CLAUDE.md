# CLAUDE.md - Manga Reader CMS Development Guide

## Giới thiệu

**Manga Reader CMS** - Nền tảng đọc manga với Next.js 16 + Laravel API

**Backend**: `http://localhost:8000/api/v1` (Laravel + Sanctum)
**Frontend**: `http://localhost:3000` (Next.js 16 App Router)
**Docs**: `/docs/API_DOCUMENTATION.md`

---

## Tech Stack

- **Framework**: Next.js 16.0.1 + React 19.2.0 + TypeScript 5+
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm 10.17.1
- **State**: Zustand / React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui (Radix UI) + Lucide icons
- **i18n**: next-intl (default: vi)
- **Notifications**: Sonner

---

## shadcn/ui Components

**Config**: New York style, Neutral color, RSC enabled

**Installed**: button, input, textarea, label, select, form, card, badge, avatar, skeleton, dialog, dropdown-menu, tabs, sonner

**Usage**: Import từ `@/components/ui/*`. See [shadcn/ui docs](https://ui.shadcn.com)

**Key practices**:

- Use `cn()` từ `@/lib/utils` để merge classes conditionally
- Forms: React Hook Form + zodResolver
- Toasts: `import { toast } from "sonner"`
- Không modify `/components/ui`, tạo wrappers trong `/components/[feature]`

**Add more**: `pnpm dlx shadcn@latest add [component-name]`

---

## SEO System

**Structure**: Centralized SEO config, không hard-code metadata

```
lib/seo/
├── config.ts      # siteConfig, defaultMetadata
├── metadata.ts    # generatePageMetadata(), generateMangaMetadata()
└── json-ld.ts     # Schema generators (WebSite, Breadcrumb, Book)
```

**Usage**:

- Root layout: `export const metadata = defaultMetadata` từ `config.ts`
- Dynamic pages: `generateMetadata()` async function với generators
- JSON-LD: inject schemas vào page head

---

## i18n (next-intl)

**Default locale**: `vi` (Vietnamese)

**Structure**:

- `messages/vi.json` - translations organized by feature (common, manga, auth, navigation)
- `i18n.ts` - config file
- `next.config.ts` - withNextIntl plugin

**Usage**:

- `const t = useTranslations("namespace")` in components
- `t("key")` hoặc `t("key", { param: value })` với interpolation
- `useFormatter()` for dates/numbers

**Adding new locale**: Create `messages/en.json`, update `i18n.ts` với dynamic locale

---

## Kiến trúc

```
app/                    # Next.js App Router với route groups
├── (auth)/            # login, register
├── (manga)/           # homepage, manga/[slug], manga/[slug]/[chapter]
└── (user)/            # profile, library

components/
├── ui/                # shadcn/ui base components
├── manga/             # Manga-specific
├── reader/            # Chapter reader
├── auth/              # Auth forms
├── layout/            # Navbar, Footer, etc.
└── providers/         # Context providers (React Query, Theme, OAuth)

lib/
├── api/
│   ├── client.ts      # API config
│   ├── endpoints/     # API functions (manga, auth, user, etc.)
│   └── types/         # API response types
├── hooks/             # Custom hooks
├── store/             # Zustand stores
├── seo/               # SEO configs & generators
├── utils/             # Helper functions
└── validators/        # Zod schemas

types/                 # Global TypeScript types
i18n/                  # i18n config
messages/              # Translation files
```

## Providers

**Location**: `components/providers/`

**Installed Providers**:

- `ReactQueryProvider` - TanStack Query (React Query) for data fetching & caching
- `ThemeProvider` - next-themes for dark/light mode
- `GoogleOAuthProvider` - Google OAuth authentication
- `NextIntlClientProvider` - next-intl for internationalization (in layout.tsx)

**Provider Order** (trong `app/layout.tsx`):

```tsx
<NextIntlClientProvider>
  <ReactQueryProvider>
    <GoogleOAuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </GoogleOAuthProvider>
  </ReactQueryProvider>
</NextIntlClientProvider>
```

**React Query Config**:

- `refetchOnWindowFocus: false` - No auto-refetch on focus
- `retry: 1` - Retry failed requests once
- `staleTime: 5 * 60 * 1000` - Cache data for 5 minutes

---

## Workflow

**Development**: `pnpm dev` → http://localhost:3000

**API Integration**:

1. Define types in `types/` hoặc `lib/api/types/`
2. Create API functions in `lib/api/endpoints/`
3. Use với React Query: `useQuery({ queryKey, queryFn })`

**Component Pattern**: Atomic Design

- atoms → molecules → organisms → pages
- Props interface với TypeScript
- Import types: `import type { Manga } from '@/types'`

**State Management**:

- **Local**: useState, useReducer (component state, forms)
- **Server**: React Query (API data, caching)
- **Global**: Zustand (auth, theme, bookmarks, history)

---

## Conventions

**Naming**:

- Components: `PascalCase`
- Functions/vars: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

**TypeScript**: Explicit types, avoid `any`, use type inference khi obvious

**Files**: Single responsibility (separate .types.ts nếu cần)

**Git commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`

**Comments**: Explain WHY, not WHAT

---

## 🚨 Coding Rules (MUST READ)

### File Organization & Naming

**File naming conventions** (actual usage in codebase):

- **Components**: `kebab-case.tsx` (e.g., `login-form.tsx`, `user-menu.tsx`, `manga-card.tsx`)
- **Pages**: `page.tsx` in route folders
- **Layouts**: `layout.tsx`
- **Hooks**: `use-*.ts` pattern (e.g., `use-auth.ts`, `use-manga.ts`)
- **Stores**: `camelCaseStore.ts` (e.g., `authStore.ts`)
- **Types**: `kebab-case.ts` in `/types/` (e.g., `manga.ts`, `user.ts`, `api.ts`)
- **API endpoints**: `kebab-case.ts` in `/lib/api/endpoints/`
- **Validators**: `kebab-case.ts` in `/lib/validators/`

**Export patterns**:

- Components: Named exports `export function ComponentName()`
- Pages: Default export `export default function PageName()`
- Multiple components: Export all as named exports

---

### Server vs Client Components

**Server Components (default)** - NO `"use client"` directive:

- Static pages, layouts
- Pages with `generateMetadata()`
- Server-side data fetching with `async/await`
- SEO metadata and JSON-LD schemas

**Client Components** - Require `"use client"` directive:

- Components using React hooks (`useState`, `useEffect`, `useReducer`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `document`)
- React Query hooks (`useQuery`, `useMutation`)
- next-intl hooks (`useTranslations`, `useFormatter`)
- Custom hooks that use client hooks

**Pattern** (Server wrapper → Client content):

```tsx
// app/page.tsx - Server Component
import { defaultMetadata } from "@/lib/seo/config";
import { generateWebsiteSchema } from "@/lib/seo/json-ld";
import { HomePageContent } from "./home-content";

export const metadata = defaultMetadata;

export default function HomePage() {
  const schema = generateWebsiteSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomePageContent />
    </>
  );
}

// app/home-content.tsx - Client Component
("use client");
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export function HomePageContent() {
  const t = useTranslations("homepage");
  // ... client-side logic
}
```

---

### Component Structure

**Standard import order** (as seen in codebase):

```typescript
"use client"; // Only if needed

/**
 * Component Name
 * Brief description of component purpose
 */

// 1. React imports
import { useState } from "react";

// 2. External libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 3. Next.js imports
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 4. Internal hooks
import { useAuth } from "@/lib/hooks/use-auth";

// 5. Validators/schemas
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";

// 6. Types (with 'type' keyword for type-only imports)
import type { User } from "@/types/user";

// 7. UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 8. Icons
import { ChevronDown } from "lucide-react";

// 9. Other utilities
import { cn } from "@/lib/utils";

// Component code
export function ComponentName() {
  // Logic here
}

// Sub-components (if small and only used here)
function SubComponent() {
  // ...
}
```

---

### i18n Rules (CRITICAL - MANDATORY)

**⚠️ ALL user-facing text MUST use translations** - NO exceptions!

**✅ CORRECT** (see `app/home-content.tsx`):

```tsx
"use client";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("homepage.hero");
  const tNav = useTranslations("navigation");

  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Link href="/search">{t("exploreNow")}</Link>
      <Link href="/genres">{tNav("genres")}</Link>
    </>
  );
}
```

**❌ FORBIDDEN** - Never hardcode text:

```tsx
// ❌ WRONG - Hardcoded English
<h1>Sign in</h1>
<p>Don't have an account?</p>
<Button>Login</Button>

// ❌ WRONG - Hardcoded Vietnamese
<h1>Đăng nhập</h1>
<p>Chưa có tài khoản?</p>
<Button>Đăng nhập</Button>
```

**Namespace organization** (`messages/vi.json`):

```json
{
  "common": { "save": "Lưu", "cancel": "Hủy" },
  "navigation": { "home": "Trang chủ", "genres": "Thể loại" },
  "auth": { "login": "Đăng nhập", "register": "Đăng ký" },
  "manga": { "status": { "ongoing": "Đang ra" } },
  "homepage": {
    "hero": { "title": "...", "description": "..." }
  }
}
```

**Multiple namespaces usage**:

```tsx
const t = useTranslations("manga");
const tCommon = useTranslations("common");
const tErrors = useTranslations("errors");

return (
  <>
    <h1>{t("detail.title")}</h1>
    <Button>{tCommon("save")}</Button>
    {error && <p>{tErrors("loadError")}</p>}
  </>
);
```

**⚠️ Files with i18n violations** (need refactoring):

- `components/auth/login-form.tsx` - Hardcoded English
- `components/auth/register-form.tsx` - Hardcoded English
- `components/layout/header/navbar.tsx` - Hardcoded English
- `components/layout/footer.tsx` - Hardcoded English
- `components/layout/header/user-menu.tsx` - Hardcoded English

**✅ Good example**: `app/home-content.tsx` - Correct i18n usage

---

### SEO/Metadata Rules

**MANDATORY**: Use centralized SEO configuration

**✅ Homepage/Simple pages**:

```tsx
import { defaultMetadata } from "@/lib/seo/config";
export const metadata = defaultMetadata;
```

**✅ Dynamic pages**:

```tsx
import { generateMangaMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const manga = await fetchManga(params.slug);
  return generateMangaMetadata(manga);
}
```

**✅ JSON-LD Schema**:

```tsx
import { generateWebsiteSchema, generateMangaSchema } from "@/lib/seo/json-ld";

export default function Page() {
  const schema = generateWebsiteSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Content */}
    </>
  );
}
```

**❌ FORBIDDEN** - Never hardcode metadata:

```tsx
// ❌ WRONG
export const metadata = {
  title: "My Page",
  description: "Some description",
};
```

**❌ NEVER** put SEO metadata in i18n files (`messages/vi.json`)

---

### State Management Rules

| State Type      | Solution      | Use Case                                    | Example                           |
| --------------- | ------------- | ------------------------------------------- | --------------------------------- |
| **Local UI**    | `useState`    | Form inputs, modals, toggles, local state   | `const [isOpen, setIsOpen] = ...` |
| **Server data** | React Query   | API calls, caching, pagination              | `useQuery({ queryKey, queryFn })` |
| **Global app**  | Zustand store | Auth state, theme, user preferences, global | `useAuthStore((s) => s.user)`     |

**Zustand store pattern** (`lib/store/authStore.ts`):

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
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**React Query pattern**:

```tsx
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";

const { data, isLoading, error } = useQuery({
  queryKey: ["mangas", "recent"],
  queryFn: () => mangaApi.getRecent({ per_page: 12 }),
});

if (error) return <ErrorMessage />;
if (isLoading) return <Skeleton />;
return <Content data={data?.data} />;
```

---

### API Integration Pattern

**API endpoint structure** (`lib/api/endpoints/auth.ts`):

```typescript
/**
 * Authentication API Endpoints
 * All endpoints related to user authentication
 */

import { apiClient } from "../client";
import type { AuthResponse, LoginCredentials } from "@/types/user";

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
   * Get authenticated user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/auth/profile");
  },
};
```

**Type-only imports** (MANDATORY):

```typescript
// ✅ CORRECT
import type { User, AuthResponse } from "@/types/user";
import type { Manga } from "@/types/manga";
import type { PaginatedResponse } from "@/types/api";

// ❌ WRONG
import { User, AuthResponse } from "@/types/user";
```

**Usage in components**:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";

// Query
const { data } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) => mangaApi.create(data),
  onSuccess: () => toast.success("Created!"),
});
```

---

### Form Validation Pattern

**1. Define Zod schema** in `/lib/validators/`:

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**2. Use in component**:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});

async function onSubmit(data: LoginFormData) {
  // Data is type-safe and validated
}
```

**3. Form UI with shadcn/ui**:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("email")}</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">{t("submit")}</Button>
  </form>
</Form>
```

---

### UI Component Rules

**shadcn/ui import pattern**:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
```

**Conditional classes with `cn()`**:

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    isActive && "active-class",
    variant === "primary" && "primary-variant"
  )}
/>;
```

**Toast notifications with Sonner**:

```tsx
import { toast } from "sonner";

toast.success("Title", { description: "Success details" });
toast.error("Error", { description: "Error details" });
toast("Info message");
```

**❌ NEVER modify** `/components/ui/*` - Create wrappers instead

---

### Utilities & Helpers

**Place helpers in `/lib/utils.ts`** - NOT in component files:

```typescript
// ✅ CORRECT - lib/utils.ts
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ✅ Usage in component
import { formatNumber } from "@/lib/utils";
<span>{formatNumber(manga.views)}</span>;
```

**❌ NEVER define helpers inside component files**:

```tsx
// ❌ WRONG
export function MangaCard() {
  // Helper should be in lib/utils.ts
  function formatNumber(num: number) { ... }
}
```

---

### Code Quality Rules

**JSDoc comments**:

```typescript
/**
 * Component Name
 * Brief description of component purpose and behavior
 */
export function ComponentName() { ... }

/**
 * Format number to K/M notation
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.5M")
 */
export function formatNumber(num: number): string { ... }
```

**TypeScript best practices**:

- ✅ Explicit return types for functions
- ✅ Use type inference for simple variables
- ✅ Prefer `unknown` over `any`
- ✅ Use `type` keyword for type-only imports

**Error handling pattern**:

```typescript
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  toast.error("Error", { description: errorMessage });
  return { success: false, error: errorMessage };
}
```

**Code comments**:

- ✅ Explain WHY, not WHAT
- ✅ Use JSDoc for public APIs
- ❌ NO TODO comments - Use GitHub Issues instead
- ❌ NO commented-out code

---

### Next.js Best Practices

**Image optimization**:

```tsx
// ✅ CORRECT
import Image from "next/image";
<Image
  src={manga.cover_full_url}
  alt={manga.name}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>;

// ❌ WRONG
<img src={manga.cover_full_url} alt={manga.name} />;
```

**Links**:

```tsx
// ✅ CORRECT
import Link from "next/link";
<Link href="/manga/one-piece">One Piece</Link>;

// ❌ WRONG
<a href="/manga/one-piece">One Piece</a>;
```

---

### File Reference Examples

**✅ Good examples to study**:

- `app/home-content.tsx` - Correct i18n usage, component structure
- `app/page.tsx` - Server/Client split, metadata, JSON-LD
- `lib/api/endpoints/auth.ts` - API endpoint pattern
- `lib/api/endpoints/manga.ts` - API endpoint with query params
- `lib/store/authStore.ts` - Zustand store with persist
- `lib/hooks/use-auth.ts` - Custom hooks pattern
- `lib/validators/auth.ts` - Zod validation schemas
- `lib/seo/metadata.ts` - Metadata generators
- `lib/seo/json-ld.ts` - JSON-LD schema generators
- `lib/utils.ts` - Utility functions
- `components/auth/protected-route.tsx` - Route protection pattern

**❌ Anti-patterns (need refactoring)**:

- `components/auth/login-form.tsx` - ❌ Hardcoded English text
- `components/auth/register-form.tsx` - ❌ Hardcoded English text
- `components/layout/header/navbar.tsx` - ❌ Hardcoded English text
- `components/layout/footer.tsx` - ❌ Hardcoded English text
- `components/layout/header/user-menu.tsx` - ❌ Hardcoded text + TODO comment

---

### Quick Reference Checklist

Before committing code, check:

- [ ] All text uses `useTranslations()` - NO hardcoded strings
- [ ] Metadata uses centralized config or generators
- [ ] Helper functions in `/lib/utils.ts`, not component files
- [ ] Type-only imports use `import type { ... }`
- [ ] Server/Client components correctly separated
- [ ] Forms use React Hook Form + Zod validation
- [ ] API calls use React Query (`useQuery`/`useMutation`)
- [ ] Images use Next.js `<Image>` component
- [ ] Links use Next.js `<Link>` component
- [ ] No TODO comments (use GitHub Issues)
- [ ] No `any` types
- [ ] JSDoc comments on public APIs
- [ ] Consistent file naming (`kebab-case.tsx`)

---

## API Endpoints

**Base URL**: `http://localhost:8000/api/v1`

**Auth**: `POST /auth/{login,register,google,logout}`

**Manga**:

- `GET /mangas` - list (pagination, filters)
- `GET /mangas/{recent,hot,search}` - specialized lists
- `GET /mangas/{slug}` - detail
- `GET /mangas/{slug}/chapters` - chapter list

**Chapters**: `GET /mangas/{slug}/chapters/{chapterSlug}`, `POST /chapters/{id}/view`

**User**: `GET/PUT /user/profile`, `POST /user/avatar`

**Library**: `GET /user/{history,bookmarks}`, `POST/DELETE /user/bookmarks`

**Comments & Ratings**: `GET/POST /mangas/{id}/{comments,ratings}`

**Genres**: `GET /genres`

**Full docs**: `/docs/API_DOCUMENTATION.md`

---

_Last updated: 2025-11-03_
