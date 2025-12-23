# SEO & Metadata

**Centralized SEO configuration and metadata generation**

**Prerequisites:**

- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Understanding Server Components
- [i18n Guide](./06-I18N-GUIDE.md) - Understanding Translations

---

## Table of Contents

- [SEO System Overview](#seo-system-overview)
- [Centralized Configuration](#centralized-configuration)
- [Localization (i18n)](#localization-i18n)
- [Static Page Metadata](#static-page-metadata)
- [Dynamic Page Metadata](#dynamic-page-metadata)
- [JSON-LD Schemas](#json-ld-schemas)
- [Forbidden Patterns](#forbidden-patterns)

---

## SEO System Overview

### Directory Structure

```
lib/seo/
├── config.ts       # Infrastructure config (reads .env)
├── metadata.ts     # Metadata generator functions (reads i18n)
└── json-ld.ts      # JSON-LD schema generators
```

### Core Principles

1.  **Infrastructure via Env**: API URLs, Site Name, and IDs live in `.env`.
2.  **Content via i18n**: Titles, Descriptions, and Keywords live in `messages/*.json`.
3.  **No Hardcoding**: Never hardcode user-facing strings in `config.ts`.
4.  **Generators**: Use generator functions for all pages (even static ones) to ensure i18n access.

---

## Centralized Configuration

### Environment Variables

We use `.env` for infrastructure settings that might change between environments (dev/prod).

**`.env.local`:**

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Manga Reader CMS"
NEXT_PUBLIC_TWITTER_HANDLE="@manga-reader"
```

### Site Configuration (`lib/seo/config.ts`)

This file acts as a bridge between `.env` and the app. It does **NOT** contain text content.

```typescript
export const siteConfig = {
  // Site identity (from Env)
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Manga Reader CMS",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  links: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
  },
  // ...
};
```

---

## Localization (i18n)

SEO content must be localized. We use a dedicated `seo` namespace in translation files.

**`messages/vi.json`:**

```json
{
  "seo": {
    "default": {
      "title": "{siteName} - Đọc Hentai Tiếng Việt Miễn Phí",
      "template": "%s | {siteName}",
      "description": "Web đọc truyện hentai, doujinshi tiếng Việt..."
    },
    "keywords": ["hentai", "truyện tranh", "manga"]
  }
}
```

---

## Static Page Metadata

Even for static pages, we use `generateMetadata` to access translations properly.

### Homepage / Root Layout

```tsx
// app/layout.tsx
import { generateDefaultMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return generateDefaultMetadata();
}
```

### Custom Static Page

```tsx
// app/about/page.tsx
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return generatePageMetadata({
    title: t("title"), // "About Us"
    description: t("description"),
  });
}
```

---

## Dynamic Page Metadata

### Metadata Generator Functions

**`lib/seo/metadata.ts`:**

This file exports async functions that combine `siteConfig` (env) and `getTranslations` (i18n).

```typescript
export async function generateMangaMetadata(manga: Manga): Promise<Metadata> {
  // ... logic to formatting title ...
  return generatePageMetadata({
    title: manga.name,
    description: `Read ${manga.name} online...`,
    path: `/manga/${manga.slug}`,
  });
}
```

### Using Generators in Pages

**Dynamic manga page:**

```tsx
// app/manga/[slug]/page.tsx
import { generateMangaMetadata } from "@/lib/seo/metadata";
import { mangaApi } from "@/lib/api/endpoints/manga";

export async function generateMetadata({ params }) {
  const manga = await mangaApi.getDetail(params.slug);
  return generateMangaMetadata(manga);
}
```

---

## JSON-LD Schemas

JSON-LD generators in `lib/seo/json-ld.ts` remain largely the same, but ensure they use `siteConfig` for URLs and Names to respect environment variables.

---

## Forbidden Patterns

### ❌ NEVER Hardcode Strings in `config.ts`

```typescript
// ❌ WRONG
export const siteConfig = {
  name: "Động Hentai", // Hardcoded language!
  description: "Web đọc truyện...", // Hardcoded language!
};
```

### ❌ NEVER Export Static Metadata Objects

```tsx
// ❌ WRONG
export const metadata = {
  title: "My Page", // Cannot be translated!
};
```

### ✅ CORRECT Pattern

```tsx
// ✅ CORRECT
export async function generateMetadata() {
  const t = await getTranslations("page");
  return {
    title: t("title"),
  };
}
```

---

## SEO Checklist

Before deploying:

- [ ] `.env` variables are set for production URLs.
- [ ] `messages/*.json` contain all SEO strings (keywords, templates).
- [ ] All pages use `async function generateMetadata()`.
- [ ] No hardcoded strings in `lib/seo/config.ts`.
- [ ] JSON-LD schemas are present and valid.

---
