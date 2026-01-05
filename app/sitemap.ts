/**
 * Sitemap Index
 * Root sitemap that references all sub-sitemaps
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/sitemap-manga.xml`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/sitemap-chapters.xml`,
      lastModified: now,
    },
  ];
}
