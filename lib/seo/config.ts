import type { Metadata } from "next";

/**
 * Centralized SEO Configuration
 *
 * ⭐ EDIT THIS FILE TO UPDATE SEO FOR THE ENTIRE SITE ⭐
 *
 * This file contains all SEO-related configuration for the application.
 * Any changes made here will automatically apply across all pages.
 *
 * Usage:
 * 1. Update site information below (name, description, etc.)
 * 2. Import and use in pages: import { defaultMetadata } from '@/lib/seo/config'
 * 3. All pages will automatically inherit these settings
 */

/**
 * Site Configuration
 *
 * Core site information used throughout the application.
 * Update these values to change site-wide SEO.
 */
export const siteConfig = {
  // Site identity
  name: "Manga Reader CMS",
  shortName: "Manga Reader",
  description:
    "Nền tảng đọc manga trực tuyến với hàng ngàn đầu truyện. Đọc manga miễn phí, cập nhật nhanh nhất, chất lượng cao.",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Images
  ogImage: "/og-image.jpg", // Default Open Graph image
  favicon: "/favicon.ico",

  // Keywords for better SEO
  keywords: [
    "manga",
    "truyện tranh",
    "đọc manga online",
    "manga tiếng việt",
    "đọc truyện tranh",
    "manga free",
    "manga reader",
    "truyện tranh online",
  ],

  // Social media links
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourrepo",
    facebook: "https://facebook.com/yourpage",
  },

  // Author information
  authors: [
    {
      name: "Manga Reader Team",
      url: "https://yourwebsite.com",
    },
  ],

  // Organization info (for JSON-LD)
  creator: "Manga Reader Team",
  publisher: "Manga Reader CMS",
} as const;

/**
 * Default Metadata Template
 *
 * This is the base metadata used across all pages.
 * Pages can extend or override these settings as needed.
 *
 * Usage in pages:
 * ```typescript
 * import { defaultMetadata } from '@/lib/seo/config';
 * export const metadata = defaultMetadata;
 * ```
 */
export const defaultMetadata: Metadata = {
  // Title configuration
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`, // e.g., "One Piece | Manga Reader CMS"
  },

  // Basic metadata
  description: siteConfig.description,
  keywords: Array.from(siteConfig.keywords),
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,

  // Application name
  applicationName: siteConfig.name,

  // Icons
  icons: {
    icon: siteConfig.favicon,
    apple: "/apple-touch-icon.png",
  },

  // Manifest for PWA (if needed in future)
  manifest: "/manifest.json",

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yourhandle", // Update with actual Twitter handle
    site: "@yourhandle", // Update with actual Twitter handle
  },

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add when you have these)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },

  // Other metadata
  category: "Entertainment",
  metadataBase: new URL(siteConfig.url),
};

/**
 * Page-specific metadata helpers
 *
 * Use these constants for specific page types
 */
export const pageTypes = {
  home: "website",
  manga: "article",
  chapter: "article",
  profile: "profile",
} as const;

/**
 * Robots directives for specific page types
 *
 * Use these for pages that need different robot rules
 */
export const robotsConfig = {
  // Allow indexing and following
  allow: {
    index: true,
    follow: true,
  },
  // Prevent indexing but allow following links
  noindex: {
    index: false,
    follow: true,
  },
  // Prevent both indexing and following
  none: {
    index: false,
    follow: false,
  },
} as const;

/**
 * Helper function to build absolute URLs
 *
 * @param path - Relative path (e.g., '/manga/one-piece')
 * @returns Absolute URL (e.g., 'https://yourdomain.com/manga/one-piece')
 */
export function buildUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/**
 * Helper function to build image URLs
 *
 * @param imagePath - Image path (relative or absolute)
 * @returns Absolute image URL
 */
export function buildImageUrl(imagePath: string): string {
  // If already absolute URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Otherwise, build absolute URL
  return buildUrl(imagePath);
}
