import type { Metadata } from "next";
import { siteConfig, buildUrl, buildImageUrl } from "./config";

/**
 * Metadata Generators
 *
 * This file contains reusable functions to generate metadata for different page types.
 * All functions automatically use the centralized siteConfig, ensuring consistency.
 *
 * These generators help avoid repetitive code and maintain SEO consistency
 * across the entire application.
 */

/**
 * Interface for generic page metadata parameters
 */
interface PageMetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  noindex?: boolean;
}

/**
 * Generate metadata for a generic page
 *
 * This is the most flexible generator that can be used for any page type.
 *
 * @example
 * ```typescript
 * export const metadata = generatePageMetadata({
 *   title: "Thể loại Action",
 *   description: "Khám phá các manga thể loại hành động...",
 *   path: "/genres/action",
 * });
 * ```
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  keywords = [],
  type = "website",
  noindex = false,
}: PageMetadataParams): Metadata {
  const url = buildUrl(path);
  const ogImage = image
    ? buildImageUrl(image)
    : buildImageUrl(siteConfig.ogImage);

  // Combine provided keywords with default site keywords
  const allKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title,
    description,
    keywords: allKeywords,

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Robots
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Generate metadata for manga detail pages
 *
 * Optimized for manga detail pages with rich information.
 *
 * @example
 * ```typescript
 * export async function generateMetadata({ params }) {
 *   const manga = await fetchMangaBySlug(params.slug);
 *   return generateMangaMetadata(manga);
 * }
 * ```
 */
export function generateMangaMetadata(manga: {
  name: string;
  name_alt?: string;
  pilot: string;
  cover_full_url: string;
  slug: string;
  average_rating?: number;
  views?: number;
  status?: number;
  genres?: Array<{ name: string }>;
}): Metadata {
  // Clean HTML from pilot description
  const cleanDescription = manga.pilot
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  // Build keywords from genres
  const genreKeywords = manga.genres?.map((g) => g.name) || [];

  // Build title with alternative name if available
  const title = manga.name_alt
    ? `${manga.name} (${manga.name_alt})`
    : manga.name;

  // Build description with stats
  let description = cleanDescription;
  if (manga.average_rating) {
    description += ` | Đánh giá: ${manga.average_rating}/5`;
  }
  if (manga.views) {
    description += ` | ${manga.views.toLocaleString("vi-VN")} lượt xem`;
  }

  return generatePageMetadata({
    title,
    description,
    path: `/manga/${manga.slug}`,
    image: manga.cover_full_url,
    keywords: [...genreKeywords, "manga", manga.name],
    type: "article",
  });
}

/**
 * Generate metadata for chapter reader pages
 *
 * Optimized for chapter reader pages.
 *
 * @example
 * ```typescript
 * export async function generateMetadata({ params }) {
 *   const chapter = await fetchChapter(params.chapterSlug);
 *   return generateChapterMetadata(chapter);
 * }
 * ```
 */
export function generateChapterMetadata(chapter: {
  name: string;
  slug: string;
  order?: number;
  manga: {
    name: string;
    slug: string;
    cover_full_url?: string;
  };
}): Metadata {
  const title = `${chapter.manga.name} - ${chapter.name}`;
  const description = `Đọc ${chapter.manga.name} ${chapter.name} tiếng Việt. Cập nhật nhanh nhất, chất lượng cao.`;

  return generatePageMetadata({
    title,
    description,
    path: `/manga/${chapter.manga.slug}/${chapter.slug}`,
    image: chapter.manga.cover_full_url,
    keywords: [chapter.manga.name, chapter.name, "đọc manga", "chapter"],
    type: "article",
  });
}

/**
 * Generate metadata for genre pages
 *
 * @example
 * ```typescript
 * export async function generateMetadata({ params }) {
 *   const genre = await fetchGenre(params.slug);
 *   return generateGenreMetadata(genre);
 * }
 * ```
 */
export function generateGenreMetadata(genre: {
  name: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `Thể loại ${genre.name}`;
  const description =
    genre.description ||
    `Khám phá các manga thể loại ${genre.name}. Đọc truyện tranh ${genre.name} miễn phí, cập nhật liên tục.`;

  return generatePageMetadata({
    title,
    description,
    path: `/genres/${genre.slug}`,
    keywords: [genre.name, "thể loại", "manga", "truyện tranh"],
  });
}

/**
 * Generate metadata for search results pages
 *
 * @example
 * ```typescript
 * export function generateMetadata({ searchParams }) {
 *   return generateSearchMetadata(searchParams.q);
 * }
 * ```
 */
export function generateSearchMetadata(query: string): Metadata {
  const title = `Tìm kiếm: ${query}`;
  const description = `Kết quả tìm kiếm cho "${query}". Tìm kiếm manga, tác giả, thể loại và nhiều hơn nữa.`;

  return generatePageMetadata({
    title,
    description,
    path: `/search?q=${encodeURIComponent(query)}`,
    keywords: [query, "tìm kiếm", "search"],
    noindex: true, // Search result pages typically shouldn't be indexed
  });
}

/**
 * Generate metadata for user profile pages
 *
 * @example
 * ```typescript
 * export async function generateMetadata() {
 *   const user = await getCurrentUser();
 *   return generateProfileMetadata(user);
 * }
 * ```
 */
export function generateProfileMetadata(user: {
  name: string;
  avatar_full_url?: string;
}): Metadata {
  const title = `Trang cá nhân - ${user.name}`;
  const description = `Thư viện manga và lịch sử đọc của ${user.name}`;

  return generatePageMetadata({
    title,
    description,
    path: "/profile",
    image: user.avatar_full_url,
    type: "profile",
    noindex: true, // User profiles typically shouldn't be indexed
  });
}

/**
 * Generate metadata for library/history pages
 *
 * @example
 * ```typescript
 * export const metadata = generateLibraryMetadata();
 * ```
 */
export function generateLibraryMetadata(): Metadata {
  return generatePageMetadata({
    title: "Thư viện của tôi",
    description:
      "Quản lý manga đã lưu, lịch sử đọc và tiến độ đọc truyện của bạn.",
    path: "/library",
    noindex: true, // Private pages shouldn't be indexed
  });
}

/**
 * Generate metadata for artist pages
 *
 * @example
 * ```typescript
 * export async function generateMetadata({ params }) {
 *   const artist = await fetchArtist(params.slug);
 *   return generateArtistMetadata(artist);
 * }
 * ```
 */
export function generateArtistMetadata(artist: {
  name: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `Tác giả ${artist.name}`;
  const description =
    artist.description ||
    `Xem tất cả manga của tác giả ${artist.name}. Đọc truyện tranh tiếng Việt miễn phí.`;

  return generatePageMetadata({
    title,
    description,
    path: `/artists/${artist.slug}`,
    keywords: [artist.name, "tác giả", "artist", "manga"],
  });
}

/**
 * Helper: Strip HTML tags from string
 *
 * @param html - HTML string
 * @returns Clean text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Helper: Truncate text to specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 160 for meta descriptions)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
