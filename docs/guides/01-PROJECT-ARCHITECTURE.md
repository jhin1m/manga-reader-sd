# Project Architecture

**Understanding the codebase structure, routing, and organizational conventions**

**Prerequisites:**

- [Getting Started](./00-GETTING-STARTED.md) - Installation and setup

---

## Table of Contents

- [Directory Structure](#directory-structure)
- [Routing with App Router](#routing-with-app-router)
- [Component Organization](#component-organization)
- [File Naming Conventions](#file-naming-conventions)
- [Export Patterns](#export-patterns)
- [TypeScript Conventions](#typescript-conventions)
- [Git Commit Conventions](#git-commit-conventions)

---

## Directory Structure

### Complete Project Layout

```
manga-reader-sd/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/                  # Route group: Authentication
│   │   ├── login/              # /login route
│   │   │   └── page.tsx
│   │   └── register/           # /register route
│   │       └── page.tsx
│   │
│   ├── (manga)/                 # Route group: Manga features
│   │   ├── page.tsx            # Homepage (/)
│   │   ├── home-content.tsx    # Client component for homepage
│   │   ├── manga/
│   │   │   └── [slug]/         # /manga/[slug]
│   │   │       ├── page.tsx
│   │   │       └── [chapter]/  # /manga/[slug]/[chapter]
│   │   │           └── page.tsx
│   │   ├── search/             # /search
│   │   └── genres/             # /genres
│   │
│   ├── (user)/                  # Route group: User features
│   │   ├── profile/            # /profile - User profile display page
│   │   │   └── page.tsx        # Profile page component
│   │   └── library/            # /library - User's manga library
│   │       └── page.tsx        # Library page with tabs
│   │
│   ├── layout.tsx               # Root layout (providers, fonts)
│   ├── globals.css              # Global styles
│   └── not-found.tsx            # 404 page
│
├── components/
│   ├── ui/                      # shadcn/ui base components (DO NOT MODIFY)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── ...
│   │
│   ├── manga/                   # Manga-specific components
│   │   ├── manga-card.tsx
│   │   ├── manga-grid.tsx
│   │   └── chapter-list.tsx
│   │
│   ├── reader/                  # Chapter reader components
│   │   ├── reader-view.tsx      # Main reader with comments integration
│   │   ├── reader-state-reducer.ts  # useReducer for reader state (Phase 04)
│   │   ├── reader-state-actions.ts  # Action creators for reader state
│   │   ├── reader-state-refactoring-guide.md  # Migration guide
│   │   ├── image-viewer.tsx
│   │   └── navigation-controls.tsx
│   │
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── protected-route.tsx
│   │
│   ├── user/                    # User profile components
│   │   ├── profile-header.tsx   # Profile header with avatar
│   │   ├── profile-stats.tsx    # User statistics display
│   │   └── profile-achievements.tsx  # User achievements & pets
│   │
│   ├── library/                 # Library page components
│   │   ├── library-tabs.tsx     # Responsive tab navigation
│   │   ├── library-skeleton.tsx # Loading skeleton
│   │   ├── continue-reading-section.tsx  # Continue reading placeholder
│   │   ├── bookmarks-tab.tsx    # Bookmarks tab placeholder
│   │   ├── history-tab.tsx      # History tab placeholder
│   │   └── completed-tab.tsx    # Completed tab placeholder
│   │
│   ├── layout/                  # Layout components
│   │   ├── header/
│   │   │   ├── navbar.tsx
│   │   │   └── user-menu.tsx
│   │   └── footer.tsx
│   │
│   └── providers/               # React context providers
│       ├── react-query-provider.tsx
│       ├── theme-provider.tsx
│       └── google-oauth-provider.tsx
│
├── lib/
│   ├── api/                     # API integration
│   │   ├── client.ts           # Axios instance & interceptors
│   │   ├── endpoints/          # API endpoint functions
│   │   │   ├── auth.ts
│   │   │   ├── manga.ts
│   │   │   ├── user.ts
│   │   │   └── ...
│   │   └── types/              # API-specific types
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-manga.ts
│   │   └── ...
│   │
│   ├── store/                   # Zustand global stores
│   │   ├── authStore.ts
│   │   └── ...
│   │
│   ├── seo/                     # SEO configuration
│   │   ├── config.ts           # Site-wide SEO config
│   │   ├── metadata.ts         # Metadata generators
│   │   └── json-ld.ts          # JSON-LD schema generators
│   │
│   ├── validators/              # Zod validation schemas
│   │   ├── auth.ts
│   │   └── ...
│   │
│   └── utils/                   # Utility functions
│       ├── comment-cache-utils.ts  # Comment cache utilities (Phase 04)
│       └── utils.ts               # General utilities (cn, formatters, etc.)
│
├── types/                       # Global TypeScript types
│   ├── manga.ts
│   ├── user.ts
│   ├── api.ts
│   └── ...
│
├── messages/                    # i18n translation files
│   └── vi.json                 # Vietnamese (default locale)
│
├── i18n/                        # i18n configuration
│   └── request.ts
│
├── public/                      # Static assets
│   └── ...
│
├── docs/                        # Documentation
│   ├── guides/
│   ├── references/
│   └── README.md
│
├── i18n.ts                      # next-intl config
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## Routing with App Router

### Route Groups

Route groups `(name)` organize routes without affecting the URL structure:

```
app/
├── (auth)/         → /login, /register (no /auth prefix)
├── (manga)/        → /, /manga/[slug]
└── (user)/         → /profile, /library
```

**Benefits:**

- Logical organization of related routes
- Shared layouts per group
- No impact on URL paths

### Dynamic Routes

```
app/
└── manga/
    └── [slug]/              → /manga/one-piece
        ├── page.tsx
        └── [chapter]/       → /manga/one-piece/chapter-1
            └── page.tsx
```

**Accessing params:**

```tsx
// app/manga/[slug]/page.tsx
export default async function MangaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const manga = await fetchManga(params.slug);
  return <MangaDetail manga={manga} />;
}
```

---

## Component Organization

### Atomic Design Pattern

Components follow atomic design principles:

1. **Atoms** → `components/ui/` (button, input, label)
2. **Molecules** → Simple combinations (form-field with label + input)
3. **Organisms** → `components/manga/`, `components/auth/` (login-form, manga-card)
4. **Pages** → `app/**/page.tsx` (composition of organisms)

### Performance-First Component Design

Components should be designed with performance in mind:

#### Dynamic Imports for Heavy Components

Use Next.js dynamic imports for components that:
- Are below-the-fold or not immediately visible
- Have large dependencies
- Are only shown on user interaction
- Don't require SSR

```tsx
// reader-view.tsx
const ChapterReaderComments = dynamic(
  () => import("@/components/comments/chapter-reader-comments").then(mod => ({
    default: mod.ChapterReaderComments
  })),
  {
    loading: () => <CommentsSkeleton />,
    ssr: false,
  }
);
```

#### Loading State Components

Create skeleton components for dynamic imports:

```tsx
// comments-skeleton.tsx
export function CommentsSkeleton() {
  return (
    <div className="w-full max-w-4xl bg-background px-4 py-8">
      {/* Skeleton structure matching actual component */}
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-24" />
      {/* More skeleton elements... */}
    </div>
  );
}
```

### Single Responsibility

Each component file should have **one primary export**:

```tsx
// ✅ CORRECT - One main component
export function MangaCard() { ... }

// Sub-components (private, small, only used here)
function CoverImage() { ... }
function CardFooter() { ... }
```

```tsx
// ❌ WRONG - Multiple unrelated components
export function MangaCard() { ... }
export function UserProfile() { ... }  // Should be separate file
```

### State Management Patterns

#### useReducer for Complex State

Components with multiple related state values should use `useReducer`:

```tsx
// components/reader/reader-view.tsx - Example from Phase 04
import { readerReducer, initialState } from "./reader-state-reducer";
import { readerActions } from "./reader-state-actions";

export function ReaderView() {
  const [state, dispatch] = useReducer(readerReducer, initialState);

  // All related state in one object
  const { readingMode, zoom, showControls, currentPage } = state;

  // Type-safe actions
  const handleModeChange = () => dispatch(readerActions.setSingleMode());
  const handleZoom = () => dispatch(readerActions.zoomIn(state.zoom));
}
```

**File organization for reducer pattern:**
```
components/reader/
├── reader-view.tsx              # Main component using reducer
├── reader-state-reducer.ts      # Reducer logic and types
├── reader-state-actions.ts      # Action creators
└── reader-state-refactoring-guide.md  # Migration guide
```

#### Utility Functions for Data Transformation

For complex data operations, create dedicated utility files:

```tsx
// lib/utils/comment-cache-utils.ts - Example from Phase 04
export function insertReplyIntoComments(
  comments: Comment[],
  parentId: string,
  reply: Comment
): Comment[] {
  // Handle nested comment insertion with depth protection
}
```

---

## File Naming Conventions

### Actual Usage in Codebase

| File Type         | Convention          | Examples                                            |
| ----------------- | ------------------- | --------------------------------------------------- |
| **Components**    | `kebab-case.tsx`    | `login-form.tsx`, `manga-card.tsx`, `user-menu.tsx` |
| **Pages**         | `page.tsx`          | `app/manga/[slug]/page.tsx`                         |
| **Layouts**       | `layout.tsx`        | `app/layout.tsx`                                    |
| **Hooks**         | `use-*.ts`          | `use-auth.ts`, `use-manga.ts`                       |
| **Stores**        | `camelCaseStore.ts` | `authStore.ts`                                      |
| **Types**         | `kebab-case.ts`     | `manga.ts`, `user.ts`, `api.ts`                     |
| **API endpoints** | `kebab-case.ts`     | `lib/api/endpoints/manga.ts`                        |
| **Validators**    | `kebab-case.ts`     | `lib/validators/auth.ts`                            |

### Component Naming

- **File name**: `kebab-case.tsx` (e.g., `manga-card.tsx`)
- **Component name**: `PascalCase` (e.g., `MangaCard`)
- **Function/variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

---

## Export Patterns

### Components

**Named exports** (preferred for components):

```tsx
// manga-card.tsx
export function MangaCard() {
  return <div>...</div>;
}

// Usage
import { MangaCard } from "@/components/manga/manga-card";
```

### Pages

**Default exports** (Next.js requirement):

```tsx
// app/page.tsx
export default function HomePage() {
  return <div>...</div>;
}
```

### Multiple Related Components

Export all as **named exports**:

```tsx
// form-components.tsx
export function FormHeader() { ... }
export function FormBody() { ... }
export function FormFooter() { ... }

// Usage
import { FormHeader, FormBody, FormFooter } from '@/components/form-components'
```

### Types

Always use **type-only imports**:

```tsx
// ✅ CORRECT
import type { Manga } from "@/types/manga";
import type { User, AuthResponse } from "@/types/user";

// ❌ WRONG
import { Manga } from "@/types/manga";
```

---

## TypeScript Conventions

### Type Definitions

1. **Explicit return types** for functions:

   ```tsx
   // ✅ CORRECT
   export function formatNumber(num: number): string {
     return num.toLocaleString();
   }
   ```

2. **Type inference** for obvious cases:

   ```tsx
   // ✅ CORRECT - Type is obvious
   const count = 10;
   const isActive = true;
   ```

3. **Prefer `unknown` over `any`**:

   ```tsx
   // ✅ CORRECT
   function handleError(error: unknown) {
     if (error instanceof Error) {
       console.error(error.message)
     }
   }

   // ❌ WRONG
   function handleError(error: any) { ... }
   ```

4. **Type-only imports**:

   ```tsx
   // ✅ CORRECT
   import type { Manga, Chapter } from "@/types";

   // ❌ WRONG
   import { Manga, Chapter } from "@/types";
   ```

---

## Git Commit Conventions

### Conventional Commits Format

```
<type>: <description>

[optional body]
```

### Commit Types

| Type        | Description      | Example                                    |
| ----------- | ---------------- | ------------------------------------------ |
| `feat:`     | New feature      | `feat: add manga bookmark functionality`   |
| `fix:`      | Bug fix          | `fix: resolve chapter image loading issue` |
| `refactor:` | Code refactoring | `refactor: simplify auth state management` |
| `docs:`     | Documentation    | `docs: update API integration guide`       |
| `style:`    | Code formatting  | `style: format with prettier`              |
| `test:`     | Tests            | `test: add manga search tests`             |
| `chore:`    | Build/tooling    | `chore: update dependencies`               |

### Examples

```bash
feat: implement manga search with filters

- Add search bar component
- Integrate search API endpoint
- Add genre and status filters
```

```bash
fix: correct chapter navigation on mobile

Fixes issue where next/prev chapter buttons were not responsive on mobile devices.
```

---

## Code Comments

### Guidelines

1. **Explain WHY, not WHAT**:

   ```tsx
   // ✅ GOOD - Explains reasoning
   // Using debounce to avoid excessive API calls during typing
   const debouncedSearch = useDebounce(searchQuery, 500);

   // ❌ BAD - States the obvious
   // Set the search query
   setSearchQuery(value);
   ```

2. **Use JSDoc for public APIs**:

   ```tsx
   /**
    * Fetch manga details by slug
    * @param slug - Manga slug identifier
    * @returns Promise with manga data
    */
   export async function getMangaDetail(slug: string): Promise<Manga> {
     return apiClient.get(`/mangas/${slug}`);
   }
   ```

3. **NO TODO comments** - Use GitHub Issues instead:

   ```tsx
   // ❌ WRONG
   // TODO: Add error handling

   // ✅ CORRECT
   // Create GitHub issue: "Add error handling to manga fetch"
   ```

4. **NO commented-out code**:

   ```tsx
   // ❌ WRONG
   // function oldImplementation() {
   //   ...
   // }

   // ✅ CORRECT - Remove it, use Git history if needed
   ```

---

## Related Guides

- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Component structure, import order, Server/Client split
- **[Coding Standards](../references/CODING-STANDARDS.md)** - Detailed coding rules and best practices
- **[Examples](../references/EXAMPLES.md)** - Reference files demonstrating good patterns

---

**See also:**

- [Getting Started](./00-GETTING-STARTED.md) - Setup and installation
- [State Management](./03-STATE-MANAGEMENT.md) - State management patterns
- [Task-to-Docs Mapping](../TASK-TO-DOCS-MAPPING.md) - Quick task lookup

## Component Updates (2025-12-05)

### Comments System Integration (Phase 5)

The following components have been added/updated for the Comments System:

1. **New Components** (`components/comments/`):
   - `comment-section.tsx` - Main comment section with resource type support
   - `comment-list.tsx` - Paginated list of comments
   - `comment-item.tsx` - Individual comment with replies
   - `comment-form.tsx` - Comment submission form with emoji picker
   - `comment-reply-form.tsx` - Reply form for threaded comments
   - `comment-skeleton.tsx` - Loading skeleton states
   - `comment-empty.tsx` - Empty state when no comments
   - `comment-actions.tsx` - Like, reply, and report actions

2. **Updated Components**:
   - `components/reader/reader-view.tsx` - Added CommentSection for chapter-level comments
   - `app/(manga)/manga/[slug]/manga-detail-content.tsx` - Added CommentSection for manga-level comments
   - `app/(manga)/manga/[slug]/[chapter]/page.tsx` - Updated to use ReaderView

3. **Removed Files**:
   - `app/(manga)/manga/[slug]/[chapter]/chapter-content.tsx` - Replaced by ReaderView integration

4. **Resource Types**:
   - Comments support both `manga` and `chapter` resource types
   - Context-aware comment sections based on page type

---

**Last updated**: 2025-12-16 (Phase 04 - Code Quality & Refactoring)
