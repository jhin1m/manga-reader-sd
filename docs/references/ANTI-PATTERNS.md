# Anti-Patterns

**Common mistakes and files that need refactoring**

---

## ⚠️ Files with Violations

**These files violate project standards and need refactoring:**

### 1. `components/auth/login-form.tsx`

**Issues:**

- ❌ Hardcoded English text ("Email", "Password", "Login", "Don't have an account?")
- ❌ NO i18n implementation

**Required fixes:**

- Import `useTranslations` from `next-intl`
- Replace all hardcoded strings with `t('key')`
- Add translations to `messages/vi.json` under `auth.login` namespace

**Priority**: HIGH - Authentication is core functionality

---

### 2. `components/auth/register-form.tsx`

**Issues:**

- ❌ Hardcoded English text ("Name", "Email", "Password", "Register", etc.)
- ❌ NO i18n implementation

**Required fixes:**

- Import `useTranslations` from `next-intl`
- Replace all hardcoded strings with `t('key')`
- Add translations to `messages/vi.json` under `auth.register` namespace

**Priority**: HIGH - Authentication is core functionality

---

### 3. `components/layout/header/navbar.tsx`

**Issues:**

- ❌ Hardcoded English text in navigation ("Home", "Genres", "Search", etc.)
- ❌ NO i18n implementation

**Required fixes:**

- Import `useTranslations` from `next-intl`
- Use `navigation` namespace for nav items
- Replace all hardcoded strings

**Priority**: HIGH - Navigation is visible on every page

---

### 4. `components/layout/footer.tsx`

**Issues:**

- ❌ Hardcoded English/Vietnamese mixed text
- ❌ NO consistent i18n implementation

**Required fixes:**

- Import `useTranslations` from `next-intl`
- Create `footer` namespace in `messages/vi.json`
- Replace all hardcoded strings

**Priority**: MEDIUM - Footer is visible but less critical

---

### 5. `components/layout/header/user-menu.tsx`

**Issues:**

- ❌ Hardcoded English text ("Profile", "Library", "Logout")
- ❌ Contains TODO comment
- ❌ NO i18n implementation

**Required fixes:**

- Import `useTranslations` from `next-intl`
- Use `navigation` namespace
- Remove TODO comment, create GitHub issue
- Replace all hardcoded strings

**Priority**: MEDIUM - Used by authenticated users

---

## Common Anti-Patterns by Category

### i18n Violations

#### ❌ WRONG - Hardcoded English

```tsx
export function Component() {
  return (
    <div>
      <h1>Welcome to Manga Reader</h1>
      <button>Login</button>
      <p>Don't have an account?</p>
    </div>
  );
}
```

#### ❌ WRONG - Hardcoded Vietnamese

```tsx
export function Component() {
  return (
    <div>
      <h1>Chào mừng đến Manga Reader</h1>
      <button>Đăng nhập</button>
      <p>Chưa có tài khoản?</p>
    </div>
  );
}
```

#### ❌ WRONG - Mixed Hardcoded Text

```tsx
export function Component() {
  const message = "Welcome";
  const error = "An error occurred";

  return (
    <div>
      <h1>{message}</h1>
      {error && <p>{error}</p>}
    </div>
  );
}
```

#### ✅ CORRECT - Using Translations

```tsx
"use client";

import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("namespace");

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <button>{t("login")}</button>
      <p>{t("noAccount")}</p>
    </div>
  );
}
```

**Reference**: [i18n Guide](../guides/06-I18N-GUIDE.md)

---

### SEO/Metadata Violations

#### ❌ WRONG - Hardcoded Metadata

```tsx
// app/about/page.tsx
export const metadata = {
  title: "About Us",
  description: "Learn about our platform",
  openGraph: {
    title: "About Us",
    description: "Learn about our platform",
  },
};
```

#### ❌ WRONG - SEO in i18n Files

```json
// messages/vi.json
{
  "seo": {
    "title": "Manga Reader CMS",
    "description": "Platform đọc manga..."
  }
}
```

#### ✅ CORRECT - Using Centralized Config

```tsx
// app/page.tsx
import { defaultMetadata } from "@/lib/seo/config";

export const metadata = defaultMetadata;

// app/manga/[slug]/page.tsx
import { generateMangaMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const manga = await fetchManga(params.slug);
  return generateMangaMetadata(manga);
}
```

**Reference**: [SEO Guide](../guides/07-SEO-METADATA.md)

---

### Component Violations

#### ❌ WRONG - Native HTML Elements

```tsx
// Wrong: Using <img>
<img src={manga.cover_url} alt={manga.name} />

// Wrong: Using <a>
<a href="/manga/one-piece">One Piece</a>
```

#### ✅ CORRECT - Next.js Components

```tsx
// Correct: Using Next.js Image
import Image from "next/image";

<Image
  src={manga.cover_url}
  alt={manga.name}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>;

// Correct: Using Next.js Link
import Link from "next/link";

<Link href="/manga/one-piece">One Piece</Link>;
```

**Reference**: [Next.js Best Practices](../guides/09-NEXTJS-BEST-PRACTICES.md)

---

### TypeScript Violations

#### ❌ WRONG - Using `any`

```typescript
function handleSubmit(data: any) {
  console.log(data.email); // No type safety
}

const response: any = await fetchData();
```

#### ❌ WRONG - No Return Types

```typescript
function formatNumber(num: number) {
  return num.toLocaleString();
}

async function fetchManga(slug: string) {
  return apiClient.get(`/mangas/${slug}`);
}
```

#### ❌ WRONG - Regular Imports for Types

```typescript
import { Manga, User } from "@/types";
```

#### ✅ CORRECT - Proper TypeScript

```typescript
// Explicit return types
function formatNumber(num: number): string {
  return num.toLocaleString();
}

async function fetchManga(slug: string): Promise<Manga> {
  return apiClient.get(`/mangas/${slug}`);
}

// Type-only imports
import type { Manga, User } from "@/types";

// Use unknown over any
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

**Reference**: [Coding Standards](./CODING-STANDARDS.md)

---

### File Organization Violations

#### ❌ WRONG - Helpers in Components

```tsx
// components/manga/manga-card.tsx
export function MangaCard() {
  // Helper should be in lib/utils.ts
  function formatViews(views: number): string {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views.toString();
  }

  return <div>{formatViews(manga.views)}</div>;
}
```

#### ✅ CORRECT - Helpers in lib/utils.ts

```typescript
// lib/utils.ts
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// components/manga/manga-card.tsx
import { formatNumber } from '@/lib/utils'

export function MangaCard() {
  return <div>{formatNumber(manga.views)}</div>
}
```

**Reference**: [Project Architecture](../guides/01-PROJECT-ARCHITECTURE.md)

---

### State Management Violations

#### ❌ WRONG - Storing API Data in useState

```tsx
const [manga, setManga] = useState(null);

useEffect(() => {
  fetchManga(slug).then(setManga);
}, [slug]);
```

#### ✅ CORRECT - Using React Query

```tsx
const { data: manga, isLoading } = useQuery({
  queryKey: ["manga", slug],
  queryFn: () => mangaApi.getDetail(slug),
});
```

**Reference**: [State Management](../guides/03-STATE-MANAGEMENT.md)

---

### Code Quality Violations

#### ❌ WRONG - TODO Comments

```typescript
// TODO: Add error handling
function fetchData() {}

// TODO: Fix this later
const result = await apiCall();
```

#### ❌ WRONG - Commented-Out Code

```typescript
// function oldImplementation() {
//   const data = fetchOldWay()
//   return processOldWay(data)
// }

function newImplementation() {
  return fetchNewWay();
}
```

#### ❌ WRONG - Obvious Comments

```typescript
// Set the search query
setSearchQuery(value);

// Loop through mangas
mangas.forEach((manga) => {});
```

#### ✅ CORRECT - Meaningful Comments

```typescript
// Using debounce to prevent excessive API calls during typing
const debouncedSearch = useDebounce(searchQuery, 500);

// Fetch on server to enable caching and improve SEO
export async function generateMetadata({ params }) {}
```

**Reference**: [Coding Standards](./CODING-STANDARDS.md)

---

### shadcn/ui Violations

#### ❌ WRONG - Modifying Base Components

```tsx
// components/ui/button.tsx
export function Button() {
  // Adding custom logic to shadcn/ui component
  const [isSpecial, setIsSpecial] = useState(false);

  // Custom modifications...
}
```

#### ✅ CORRECT - Creating Wrappers

```tsx
// components/manga/bookmark-button.tsx
import { Button } from "@/components/ui/button";

export function BookmarkButton({ isBookmarked, onClick }) {
  return (
    <Button variant={isBookmarked ? "default" : "outline"} onClick={onClick}>
      <Bookmark className={isBookmarked ? "fill-current" : ""} />
    </Button>
  );
}
```

**Reference**: [UI Components](../guides/08-UI-COMPONENTS.md)

---

## Refactoring Priority

### HIGH Priority (Fix Immediately)

1. **Authentication forms** - `login-form.tsx`, `register-form.tsx`
2. **Navigation** - `navbar.tsx` (visible on all pages)
3. **All hardcoded text** - Breaks i18n

### MEDIUM Priority (Fix Soon)

4. **User menu** - `user-menu.tsx`
5. **Footer** - `footer.tsx`
6. **Any files with `any` types**

### LOW Priority (Fix When Convenient)

7. **TODO comments** - Convert to GitHub issues
8. **Commented-out code** - Remove

---

## How to Fix

### For i18n Violations

1. Import `useTranslations` from `next-intl`
2. Identify namespace (e.g., `auth.login`, `navigation`)
3. Add translations to `messages/vi.json`
4. Replace hardcoded strings with `t('key')`

**Detailed guide**: [i18n Guide](../guides/06-I18N-GUIDE.md)

### For Component Violations

1. Replace `<img>` with Next.js `<Image>`
2. Replace `<a>` with Next.js `<Link>`
3. Add proper `fill`, `sizes` attributes
4. Ensure proper TypeScript types

**Detailed guide**: [Next.js Best Practices](../guides/09-NEXTJS-BEST-PRACTICES.md)

---

## Related References

- **[Checklist](./CHECKLIST.md)** - Pre-commit verification
- **[Examples](./EXAMPLES.md)** - Good reference files
- **[Coding Standards](./CODING-STANDARDS.md)** - Conventions

---

**Last updated**: 2025-11-15
