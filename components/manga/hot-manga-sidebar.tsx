"use client";

/**
 * HotMangaSidebar Component
 * Displays top ranked manga with tabs (day/week/all)
 * Shows ranking numbers and compact card design
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import type { MangaListItem } from "@/types/manga";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HotMangaSidebarSkeleton } from "@/components/layout/loading";
import { cn } from "@/lib/utils";
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";

export interface HotMangaSidebarProps {
  maxItems?: number;
  className?: string;
  sticky?: boolean;
}

type TabValue = "day" | "week" | "all";

/**
 * HotMangaSidebar component
 * Fetches hot manga and displays ranked list with tabs
 *
 * @param maxItems - Maximum number of items to display (default: 10)
 * @param className - Optional additional CSS classes
 * @param sticky - Whether to make sidebar sticky (default: false)
 */
export function HotMangaSidebar({
  maxItems = 10,
  className,
  sticky = false,
}: HotMangaSidebarProps) {
  const t = useTranslations("homepage.sections");
  const [activeTab, setActiveTab] = useState<TabValue>("day");

  // Fetch hot manga once with higher limit
  const { data, isLoading, error } = useQuery({
    queryKey: ["mangas", "hot", "ranked"],
    queryFn: () => mangaApi.getHot({ per_page: 30 }),
  });

  // Filter and sort based on active tab
  const rankedMangas = useMemo(() => {
    if (!data?.data) return [];

    const sorted = [...data.data].sort((a, b) => {
      if (activeTab === "day") {
        return (b.views_day || 0) - (a.views_day || 0);
      }
      if (activeTab === "week") {
        return (b.views_week || 0) - (a.views_week || 0);
      }
      return b.views - a.views; // all time
    });

    return sorted.slice(0, maxItems);
  }, [data, activeTab, maxItems]);

  if (isLoading) {
    return <HotMangaSidebarSkeleton className={className} count={maxItems} />;
  }

  if (error || !data?.data || data.data.length === 0) {
    return null;
  }

  return (
    <div className={cn(sticky && "sticky top-4", className)}>
      <div>
        <div className="pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <h2 className="text-2xl font-bold">{t("topRanked")}</h2>
          </div>
        </div>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
          >
            {/* Tabs */}
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="day">{t("tabs.day")}</TabsTrigger>
              <TabsTrigger value="week">{t("tabs.week")}</TabsTrigger>
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            </TabsList>

            {/* Tab content - same for all tabs, just filtered data */}
            {["day", "week", "all"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="space-y-3">
                  {rankedMangas.map((manga, index) => (
                    <RankedMangaCard
                      key={manga.id}
                      manga={manga}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/**
 * RankedMangaCard - Compact card for sidebar ranking
 */
interface RankedMangaCardProps {
  manga: MangaListItem;
  rank: number;
}

function RankedMangaCard({ manga, rank }: RankedMangaCardProps) {
  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors group"
    >
      {/* Rank badge */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm",
          rank === 1 && "bg-yellow-500 text-yellow-950",
          rank === 2 && "bg-gray-400 text-gray-950",
          rank === 3 && "bg-orange-600 text-orange-50",
          rank > 3 && "bg-muted text-muted-foreground"
        )}
      >
        #{rank}
      </div>

      {/* Thumbnail */}
      <div className="relative h-16 w-12 flex-shrink-0 rounded overflow-hidden bg-muted">
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          fill
          sizes="20vw"
          style={{ objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform"
          placeholder="blur"
          blurDataURL={getShimmerPlaceholder()}
          priority={rank <= 3} // First 3 items get priority
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {manga.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{Number(manga.average_rating || 0).toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{formatViews(manga.views)}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Format views count to K/M notation
 */
function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
}
