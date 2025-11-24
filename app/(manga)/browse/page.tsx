/**
 * Browse Page
 * Server component for manga browsing with filters and pagination
 */

import type { Metadata } from "next";
import { defaultMetadata, siteConfig } from "@/lib/seo/config";
import { BrowseContent } from "./browse-content";

/**
 * Generate metadata for browse page
 */
export async function generateMetadata(): Promise<Metadata> {
  const title = "Duyệt Manga";
  const description =
    "Duyệt và tìm kiếm manga theo thể loại, trạng thái, và sắp xếp. Khám phá hàng ngàn bộ manga hot nhất.";

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/browse`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

interface BrowsePageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    q?: string;
    genre?: string;
  }>;
}

/**
 * Browse page - displays manga list with filters and pagination
 */
export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BrowseContent searchParams={params} />
    </div>
  );
}
