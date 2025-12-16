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
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// ✅ Memoize heavy components
export default memo(ExpensiveComponent);
```

### Component Performance

#### Dynamic Imports for Code Splitting

```typescript
// ✅ Lazy load heavy components
const CommentSection = dynamic(
  () => import("@/components/comments/comment-section"),
  {
    loading: () => <CommentSkeleton />,
    ssr: false,
  }
);
```

#### Optimize Renders

```typescript
// ✅ Avoid creating new objects/arrays in render
// ❌ BAD
const style = { color: "red", fontSize: "16px" }; // New object each render

// ✅ GOOD
const buttonStyle = useMemo(() => ({
  color: "red",
  fontSize: "16px",
}), []); // Memoized

// ✅ Use stable references for prop objects
const memoizedProps = useMemo(() => ({
  id: manga.id,
  title: manga.title,
  onBookmark: handleBookmark,
}), [manga.id, manga.title, handleBookmark]);
```

### Data Optimization

#### React Query Best Practices

```typescript
// ✅ Configure proper caching
const { data } = useQuery({
  queryKey: ["mangas", params],
  queryFn: () => mangaApi.getAll(params),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});

// ✅ Use query keys properly
export const mangaKeys = {
  all: ["mangas"] as const,
  lists: () => [...mangaKeys.all, "list"] as const,
  list: (params: any) => [...mangaKeys.lists(), params] as const,
  details: () => [...mangaKeys.all, "detail"] as const,
  detail: (id: string) => [...mangaKeys.details(), id] as const,
};
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
- [ ] **Cache**: React Query configured with appropriate cache times

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
