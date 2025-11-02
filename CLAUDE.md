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
└── layout/            # Navbar, Footer, etc.

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
