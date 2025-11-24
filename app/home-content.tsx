"use client";

/**
 * Homepage Content (Client Component)
 * Handles data fetching and rendering with i18n support
 * Uses reusable manga components from @/components/manga
 */

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";

import { mangaApi } from "@/lib/api/endpoints/manga";
import { MangaCarousel } from "@/components/manga/manga-carousel";
import { RecentlyUpdatedSection } from "@/components/manga/recently-updated-section";
import { HotMangaSidebar } from "@/components/manga/hot-manga-sidebar";
import { MangaCarouselSkeleton } from "@/components/layout/loading";

/**
 * Homepage main content component
 */
export function HomePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
        {/* Manga Carousel - Full Width */}
        <MangaCarouselSection />

        {/* Desktop: Flex layout with sidebar, Mobile: Vertical stack */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <RecentlyUpdatedSection />
          </div>

          {/* Sidebar - Shows below on mobile, on right on desktop */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <HotMangaSidebar sticky />
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * Manga Carousel Section
 * Displays featured/hot manga in a carousel
 */
function MangaCarouselSection() {
  const t = useTranslations("homepage.sections");

  const { data, isLoading } = useQuery({
    queryKey: ["mangas", "manga-carousel"],
    queryFn: () =>
      mangaApi.getHot({
        per_page: 16,
        include: "genres,artist,latest_chapter",
      }),
  });

  if (isLoading) {
    return <MangaCarouselSkeleton count={8} />;
  }

  if (!data?.data || data.data.length === 0) {
    return null;
  }

  return (
    <MangaCarousel
      mangas={data.data}
      title={t("hotManga")}
      icon={<TrendingUp className="h-6 w-6 text-primary" />}
      autoplayDelay={5000}
    />
  );
}
