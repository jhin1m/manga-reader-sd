# Sitemap Design - Manga Reader CMS

**Comprehensive sitemap structure for SEO optimization**

**Created**: 2026-01-04
**Status**: ✅ Implemented

---

## Table of Contents

- [Overview](#overview)
- [Sitemap Structure](#sitemap-structure)
- [Static Routes](#static-routes)
- [Dynamic Routes](#dynamic-routes)
- [Implementation Plan](#implementation-plan)
- [File Structure](#file-structure)
- [URL Priority & Update Frequency](#url-priority--update-frequency)
- [Next Steps](#next-steps)

---

## Overview

### Purpose

Create XML sitemaps for search engines to discover and crawl all pages efficiently.

### Requirements

1. **Static Sitemap**: Homepage, browse, auth, user pages
2. **Dynamic Sitemap**: Manga detail pages, chapter pages
3. **SEO Compliance**: Follow Google sitemap best practices
4. **Auto-generation**: Dynamic sitemaps based on database content

### Technologies

- Next.js 16 App Router sitemap.ts/sitemap.xml
- Laravel API for manga/chapter data

---

## Sitemap Structure

### Sitemap Index (sitemap.xml)

Root sitemap index that references all sub-sitemaps:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yourdomain.com/sitemap-static.xml</loc>
    <lastmod>2026-01-04T00:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yourdomain.com/sitemap-manga.xml</loc>
    <lastmod>2026-01-04T00:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yourdomain.com/sitemap-chapters.xml</loc>
    <lastmod>2026-01-04T00:00:00+00:00</lastmod>
  </sitemap>
</sitemapindex>
```

**File**: `app/sitemap.ts`

---

## Static Routes

### Pages Included

| Page     | URL       | Priority | Change Frequency |
| -------- | --------- | -------- | ---------------- |
| Homepage | `/`       | 1.0      | daily            |
| Browse   | `/browse` | 0.9      | daily            |

### Static Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-01-04T00:00:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/browse</loc>
    <lastmod>2026-01-04T00:00:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- More static pages... -->
</urlset>
```

**File**: `app/sitemap-static.ts`

---

## Dynamic Routes

### Manga Detail Pages

**Route Pattern**: `/manga/[slug]`

**Data Source**: `GET /api/v1/mangas` (paginated)

**Fields Required**:

- `slug` - URL identifier
- `updated_at` - Last modification timestamp

**Sample URLs**:

```
https://yourdomain.com/manga/one-piece
https://yourdomain.com/manga/naruto
https://yourdomain.com/manga/attack-on-titan
```

**Priority**: 0.8
**Change Frequency**: weekly

### Chapter Reader Pages

**Route Pattern**: `/manga/[manga-slug]/[chapter-slug]`

**Data Source**: `GET /api/v1/mangas/{slug}/chapters` (per manga)

**Fields Required**:

- `manga.slug` - Manga identifier
- `chapter.slug` - Chapter identifier
- `chapter.updated_at` - Last modification

**Sample URLs**:

```
https://yourdomain.com/manga/one-piece/chapter-1
https://yourdomain.com/manga/one-piece/chapter-2
https://yourdomain.com/manga/naruto/chapter-1
```

**Priority**: 0.7
**Change Frequency**: monthly

### Dynamic Sitemap Structure (Manga)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/manga/one-piece</loc>
    <lastmod>2025-12-20T10:30:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- More manga URLs... -->
</urlset>
```

**File**: `app/sitemap-manga.ts`

### Dynamic Sitemap Structure (Chapters)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/manga/one-piece/chapter-1</loc>
    <lastmod>2025-11-15T08:20:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- More chapter URLs... -->
</urlset>
```

**File**: `app/sitemap-chapters.ts`

---

## Implementation Plan

### Phase 1: Static Sitemap

1. Create `app/sitemap-static.ts`
2. Define static routes array
3. Export sitemap function
4. Test generation at `/sitemap-static.xml`

### Phase 2: Manga Sitemap

1. Create `app/sitemap-manga.ts`
2. Fetch all manga from API (paginated)
3. Map to sitemap URL format
4. Handle pagination (max 50,000 URLs per sitemap)
5. Add caching/revalidation

### Phase 3: Chapter Sitemap

1. Create `app/sitemap-chapters.ts`
2. Fetch all manga with chapters from API
3. Generate chapter URLs
4. Implement chunking if exceeds 50,000 URLs
5. Add caching/revalidation

### Phase 4: Sitemap Index

1. Create `app/sitemap.ts` (root)
2. Reference all sub-sitemaps
3. Set lastmod to latest update timestamp
4. Test at `/sitemap.xml`

### Phase 5: Optimization

1. Add ISR (Incremental Static Regeneration)
2. Implement caching strategy
3. Add error handling for API failures
4. Monitor sitemap generation time

---

## File Structure

```
app/
├── sitemap.ts                  # Sitemap index (root)
├── sitemap-static.ts           # Static pages sitemap
├── sitemap-manga.ts            # Manga detail pages sitemap
└── sitemap-chapters.ts         # Chapter pages sitemap

lib/
└── seo/
    ├── config.ts               # Existing SEO config
    ├── metadata.ts             # Existing metadata generators
    ├── json-ld.ts              # Existing JSON-LD schemas
    └── sitemap-helpers.ts      # NEW: Sitemap utility functions
```

---

## URL Priority & Update Frequency

### Priority Guidelines (Google Recommendations)

| Priority | Page Type                | Examples                  |
| -------- | ------------------------ | ------------------------- |
| 1.0      | Homepage                 | `/`                       |
| 0.9      | Main category pages      | `/browse`                 |
| 0.8      | Individual content pages | `/manga/[slug]`           |
| 0.7      | Sub-content pages        | `/manga/[slug]/[chapter]` |

### Change Frequency Guidelines

| Frequency | Page Type        | Reasoning                               |
| --------- | ---------------- | --------------------------------------- |
| `daily`   | Homepage, Browse | Content aggregation, frequently updated |
| `weekly`  | Manga details    | New chapters added regularly            |
| `monthly` | Chapters         | Content rarely changes after publish    |
| `monthly` | Auth pages       | Static content                          |

---

## SEO Best Practices

### Sitemap Limits

- **Max URLs per sitemap**: 50,000
- **Max file size**: 50 MB (uncompressed)
- **Solution**: Split into multiple sitemaps if exceeds limits

### Update Strategy

1. **Static sitemap**: Update on deployment
2. **Manga sitemap**: Revalidate daily (ISR: 86400 seconds)
3. **Chapter sitemap**: Revalidate weekly (ISR: 604800 seconds)

### Caching Strategy

```typescript
// Example ISR configuration
export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch and generate sitemap
}
```

### Error Handling

- Fallback to cached sitemap if API fails
- Log errors for monitoring
- Return partial sitemap rather than empty

---

## i18n Considerations

### Current Setup

- **Default locale**: Vietnamese (`vi`)
- **Future locales**: English, others

### URL Structure Options

**Option 1: Path-based (Recommended)**

```
https://yourdomain.com/vi/manga/one-piece
https://yourdomain.com/en/manga/one-piece
```

**Option 2: Domain-based**

```
https://vi.yourdomain.com/manga/one-piece
https://en.yourdomain.com/manga/one-piece
```

---

## Next Steps

### Implementation Order

1. ✅ Design sitemap structure (this document)
2. ✅ Create sitemap helper utilities
3. ✅ Implement static sitemap
4. ✅ Implement manga sitemap
5. ✅ Implement chapter sitemap
6. ✅ Create sitemap index

### Testing Checklist

- [ ] All sitemaps generate without errors
- [ ] URLs are absolute and properly formatted
- [ ] Timestamps are in ISO 8601 format
- [ ] File sizes under 50 MB
- [ ] URL count under 50,000 per sitemap
- [ ] Validate XML syntax with online validators
- [ ] Test sitemap accessibility at public URLs
- [ ] Verify robots.txt includes sitemap reference

### robots.txt Configuration

Add to `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Technical Implementation Examples

### 1. Sitemap Index (app/sitemap.ts)

```typescript
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url || "http://localhost:3000";

  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-manga.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-chapters.xml`,
      lastModified: new Date(),
    },
  ];
}
```

### 2. Static Sitemap (app/sitemap-static.ts)

```typescript
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url || "http://localhost:3000";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  return staticRoutes;
}
```

### 3. Manga Sitemap (app/sitemap-manga.ts)

```typescript
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";
import { mangaApi } from "@/lib/api/endpoints/manga";

export const revalidate = 86400; // Revalidate daily (24 hours)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url || "http://localhost:3000";

  try {
    // Fetch all manga (handle pagination)
    const allMangas = await fetchAllMangas();

    return allMangas.map((manga) => ({
      url: `${baseUrl}/manga/${manga.slug}`,
      lastModified: new Date(manga.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating manga sitemap:", error);
    return [];
  }
}

async function fetchAllMangas() {
  const allMangas = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await mangaApi.getList({ page, per_page: 100 });
    allMangas.push(...response.data);

    hasMore =
      response.meta.pagination.current_page <
      response.meta.pagination.last_page;
    page++;
  }

  return allMangas;
}
```

### 4. Chapter Sitemap (app/sitemap-chapters.ts)

```typescript
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";
import { mangaApi } from "@/lib/api/endpoints/manga";

export const revalidate = 604800; // Revalidate weekly (7 days)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url || "http://localhost:3000";

  try {
    // Fetch all manga
    const allMangas = await fetchAllMangas();

    // Fetch chapters for each manga
    const chapterUrls: MetadataRoute.Sitemap = [];

    for (const manga of allMangas) {
      const chapters = await mangaApi.getChapters(manga.slug);

      chapters.data.forEach((chapter) => {
        chapterUrls.push({
          url: `${baseUrl}/manga/${manga.slug}/${chapter.slug}`,
          lastModified: new Date(chapter.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      });
    }

    return chapterUrls;
  } catch (error) {
    console.error("Error generating chapter sitemap:", error);
    return [];
  }
}

async function fetchAllMangas() {
  const allMangas = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await mangaApi.getList({ page, per_page: 100 });
    allMangas.push(...response.data);

    hasMore =
      response.meta.pagination.current_page <
      response.meta.pagination.last_page;
    page++;
  }

  return allMangas;
}
```

---

## Performance Considerations

### 1. Pagination Handling

For large datasets (thousands of manga):

- Fetch in batches (100-200 per request)
- Implement cursor-based pagination if available
- Cache API responses

### 2. Build Time Optimization

Chapter sitemap may take time to generate if many manga exist:

- Consider splitting into multiple chapter sitemaps (by manga letter/category)
- Use parallel fetching where possible
- Monitor build times

### 3. Caching Strategy

```typescript
// Add Redis/Memory cache if needed
import { cache } from "react";

const getCachedMangas = cache(async () => {
  return await fetchAllMangas();
});
```

---

## Monitoring & Maintenance

### Update Schedule

- **Static sitemap**: On deployment
- **Manga sitemap**: Daily at 2 AM (cron job or ISR)
- **Chapter sitemap**: Weekly on Sundays

---

## Unresolved Questions

1. **API Pagination**: Does the manga API support efficient full dataset retrieval?
2. **Chapter Count**: How many total chapters exist? (affects chunking strategy)
3. **Update Frequency**: How often are new manga/chapters added? (affects revalidation timing)
4. **Build Time Limit**: Are there hosting platform build time limits to consider?

---

**Next Document**: Implementation guide with code examples and step-by-step instructions.
