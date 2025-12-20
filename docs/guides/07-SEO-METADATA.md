# SEO & Metadata

**Centralized SEO configuration and metadata generation**

**Prerequisites:**

- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Understanding Server Components

---

## Table of Contents

- [SEO System Overview](#seo-system-overview)
- [Centralized Configuration](#centralized-configuration)
- [Static Page Metadata](#static-page-metadata)
- [Dynamic Page Metadata](#dynamic-page-metadata)
- [JSON-LD Schemas](#json-ld-schemas)
- [Forbidden Patterns](#forbidden-patterns)

---

## SEO System Overview

### Directory Structure

```
lib/seo/
├── config.ts       # Site-wide SEO configuration
├── metadata.ts     # Metadata generator functions
└── json-ld.ts      # JSON-LD schema generators
```

### Core Principles

1. **Centralized**: All SEO config in `lib/seo/`
2. **No hardcoding**: Never hardcode metadata in pages
3. **Generators**: Use generator functions for dynamic pages
4. **Structured data**: Always include JSON-LD schemas

---

## Centralized Configuration

### Site Configuration

**`lib/seo/config.ts`:**

```typescript
/**
 * Site-wide SEO configuration
 * All metadata should derive from this config
 */

export const siteConfig = {
  name: "Manga Reader CMS",
  description:
    "Platform đọc manga trực tuyến miễn phí với hàng nghìn bộ truyện tranh Nhật Bản",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  locale: "vi_VN",
  type: "website",

  // Social links
  social: {
    facebook: "https://facebook.com/manga-reader",
    twitter: "https://twitter.com/manga-reader",
  },

  // Default images
  images: {
    default: "/og-image.jpg",
    width: 1200,
    height: 630,
  },
};

/**
 * Default metadata for the root layout
 */
export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "manga",
    "truyện tranh",
    "manga online",
    "đọc manga",
    "manga miễn phí",
    "manga tiếng việt",
  ],
  authors: [{ name: "Manga Reader Team" }],
  creator: "Manga Reader CMS",
  publisher: "Manga Reader CMS",

  // Open Graph
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: siteConfig.images.width,
        height: siteConfig.images.height,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@manga-reader",
  },

  // Verification
  verification: {
    google: "your-google-verification-code",
    // yandex: 'your-yandex-code',
    // bing: 'your-bing-code'
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

---

## Static Page Metadata

### Homepage / Simple Pages

Use `defaultMetadata` directly:

```tsx
// app/page.tsx
import { defaultMetadata } from "@/lib/seo/config";

export const metadata = defaultMetadata;

export default function HomePage() {
  return <div>Content</div>;
}
```

### Custom Static Page

```tsx
// app/about/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Thông tin về Manga Reader CMS",
  openGraph: {
    title: "Giới thiệu | Manga Reader",
    description: "Thông tin về Manga Reader CMS",
    url: `${siteConfig.url}/about`,
    images: [siteConfig.ogImage],
  },
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

---

## Dynamic Page Metadata

### Metadata Generator Functions

**`lib/seo/metadata.ts`:**

```typescript
import type { Metadata } from "next";
import { siteConfig } from "./config";
import type { Manga } from "@/types/manga";

/**
 * Generate metadata for manga detail page
 */
export function generateMangaMetadata(manga: Manga): Metadata {
  const title = `${manga.name} - Đọc truyện tranh online`;
  const description =
    manga.description?.slice(0, 160) ||
    `Đọc ${manga.name} của ${manga.author} trên Manga Reader. ${manga.chapters_count} chương`;

  const url = `${siteConfig.url}/manga/${manga.slug}`;
  const image = manga.cover_full_url || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: [
      manga.name,
      manga.author,
      "manga",
      "truyện tranh",
      ...manga.genres.map((g) => g.name),
    ],

    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 800,
          height: 1200,
          alt: manga.name,
        },
      ],
      authors: [manga.author],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for chapter page
 */
export function generateChapterMetadata(
  manga: Manga,
  chapter: Chapter
): Metadata {
  const title = `${manga.name} - ${chapter.title || `Chương ${chapter.number}`}`;
  const description = `Đọc ${manga.name} ${chapter.title || `Chương ${chapter.number}`} trên Manga Reader`;

  const url = `${siteConfig.url}/manga/${manga.slug}/${chapter.slug}`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [manga.cover_full_url || siteConfig.ogImage],
    },

    twitter: {
      card: "summary",
      title,
      description,
    },

    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for genre page
 */
export function generateGenreMetadata(genreName: string): Metadata {
  const title = `Truyện tranh ${genreName}`;
  const description = `Khám phá các bộ manga thể loại ${genreName} hay nhất trên Manga Reader`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/genres/${genreName}`,
      images: [siteConfig.ogImage],
    },
  };
}
```

### Using Metadata Generators

**Dynamic manga page:**

```tsx
// app/manga/[slug]/page.tsx
import type { Metadata } from "next";
import { generateMangaMetadata } from "@/lib/seo/metadata";
import { mangaApi } from "@/lib/api/endpoints/manga";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const manga = await mangaApi.getDetail(params.slug);
    return generateMangaMetadata(manga);
  } catch {
    return {
      title: "Manga not found",
    };
  }
}

export default function MangaDetailPage({ params }: PageProps) {
  return <MangaDetailContent slug={params.slug} />;
}
```

**Dynamic chapter page:**

```tsx
// app/manga/[slug]/[chapter]/page.tsx
import type { Metadata } from "next";
import { generateChapterMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }): Promise<Metadata> {
  const manga = await mangaApi.getDetail(params.slug);
  const chapter = await chapterApi.getDetail(params.chapter);

  return generateChapterMetadata(manga, chapter);
}

export default function ChapterPage({ params }) {
  return <ChapterContent {...params} />;
}
```

---

## JSON-LD Schemas

### Schema Generator Functions

**`lib/seo/json-ld.ts`:**

```typescript
import { siteConfig } from "./config";
import type { Manga, Chapter } from "@/types";

/**
 * Generate WebSite schema for homepage
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate Book (Manga) schema
 */
export function generateMangaSchema(manga: Manga) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: manga.name,
    author: {
      "@type": "Person",
      name: manga.author,
    },
    description: manga.description,
    image: manga.cover_full_url,
    aggregateRating: manga.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: manga.rating,
          ratingCount: manga.rating_count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    numberOfPages: manga.chapters_count,
    inLanguage: "vi",
    genre: manga.genres.map((g) => g.name),
  };
}

/**
 * Generate Article schema for chapter
 */
export function generateChapterSchema(manga: Manga, chapter: Chapter) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${manga.name} - ${chapter.title || `Chương ${chapter.number}`}`,
    image: manga.cover_full_url,
    author: {
      "@type": "Person",
      name: manga.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: chapter.created_at,
    dateModified: chapter.updated_at,
  };
}
```

### Using JSON-LD Schemas

**In Server Components:**

```tsx
// app/page.tsx
import { generateWebsiteSchema } from "@/lib/seo/json-ld";

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
```

**Manga detail page:**

```tsx
// app/manga/[slug]/page.tsx
import {
  generateMangaSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/json-ld";

export default async function MangaDetailPage({ params }) {
  const manga = await mangaApi.getDetail(params.slug);

  const mangaSchema = generateMangaSchema(manga);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Manga", url: "/manga" },
    { name: manga.name, url: `/manga/${manga.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mangaSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MangaDetailContent manga={manga} />
    </>
  );
}
```

---

## Forbidden Patterns

### ❌ NEVER Hardcode Metadata

```tsx
// ❌ WRONG - Hardcoded metadata
export const metadata = {
  title: "My Page",
  description: "Some description",
  openGraph: {
    title: "My Page",
    description: "Some description",
  },
};
```

### ❌ NEVER Put SEO in i18n Files

```json
// ❌ WRONG - messages/vi.json
{
  "seo": {
    "title": "Manga Reader CMS",
    "description": "Platform đọc manga..."
  }
}
```

**Why?** SEO metadata should be in `lib/seo/config.ts`, not translation files.

### ✅ CORRECT Pattern

```tsx
// ✅ CORRECT - Use centralized config
import { defaultMetadata } from "@/lib/seo/config";
export const metadata = defaultMetadata;

// ✅ CORRECT - Use generator functions
import { generateMangaMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const manga = await fetchManga(params.slug);
  return generateMangaMetadata(manga);
}
```

---

## Best Practices

### 1. Use Template Titles

```typescript
// lib/seo/config.ts
export const defaultMetadata = {
  title: {
    default: "Manga Reader",
    template: "%s | Manga Reader", // Page Title | Site Name
  },
  alternates: {
    canonical: siteConfig.url,
  },
};
```

### 2. Add H1 for Accessibility & SEO

Each page should have a primary H1 heading. If the design doesn't require a visible H1, use the `sr-only` class to make it available for screen readers and search engines.

```tsx
// app/home-content.tsx
<h1 className="sr-only">{t("h1")}</h1>
```

### 3. Optimize Manga Metadata Descriptions

Descriptions should be concise and match user search patterns. Avoid including dynamic stats (like views/ratings) in the meta description to prevent it from becoming outdated in search snippets.

### 4. Optimize Image for OG

- **Size**: 1200x630px (ideal for Open Graph)
- **Format**: JPEG or PNG
- **File size**: < 1MB
- **Responsive**: Provide different sizes for different platforms

### 4. Add Structured Data

Always include JSON-LD schemas for:

- Homepage: WebSite schema
- Manga pages: Book schema
- Chapter pages: Article schema
- List pages: Breadcrumb schema

### 5. Keep Descriptions Concise

- **Meta description**: 150-160 characters
- **OG description**: 200 characters max
- Focus on value proposition and keywords

---

## SEO Checklist

Before deploying:

- [ ] All pages have metadata (static or generated)
- [ ] Using centralized `siteConfig`
- [ ] Dynamic pages use generator functions
- [ ] JSON-LD schemas implemented
- [ ] Canonical URLs set
- [ ] OG images optimized and accessible
- [ ] No hardcoded metadata anywhere
- [ ] Robots meta tags configured
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured

---

## Related Guides

- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Server components for SEO
- **[Project Architecture](./01-PROJECT-ARCHITECTURE.md)** - File organization

---

## Reference Files

**Good examples:**

- `lib/seo/config.ts` - Centralized SEO config
- `lib/seo/metadata.ts` - Metadata generators
- `lib/seo/json-ld.ts` - JSON-LD schema generators
- `app/page.tsx` - Using metadata and JSON-LD

---

**Last updated**: 2025-11-15
