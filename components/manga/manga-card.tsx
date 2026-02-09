"use client";

/**
 * MangaCard Component
 * Reusable card component for displaying manga with cover, title, and metadata
 * Used in grids, lists, and carousels throughout the application
 */

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import type { MangaListItem } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";
import { mangaKeys } from "@/lib/api/query-keys";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { StarRating } from "@/components/manga/star-rating";

export interface MangaCardProps {
  manga: MangaListItem;
  className?: string;
  priority?: boolean; // For first N items in lists
}

/**
 * MangaCard component for displaying individual manga items
 * Minimalist design with essential information only
 *
 * @param manga - Manga data to display
 * @param className - Optional additional CSS classes
 */
export const MangaCard = memo(function MangaCard({
  manga,
  className,
  priority,
}: MangaCardProps) {
  const t = useTranslations("homepage.mangaCard");
  const queryClient = useQueryClient();

  // Prefetch manga detail on hover for faster navigation
  const handleMouseEnter = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: mangaKeys.detail(manga.slug),
      queryFn: () => mangaApi.getDetail(manga.slug),
      staleTime: 60_000, // 1 minute fresh
    });
  }, [queryClient, manga.slug]);

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className={cn("group flex flex-col space-y-1.5", className)}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-lg bg-muted",
          "shadow-sm hover:shadow-md transition-shadow duration-200"
        )}
      >
        {/* Cover Image */}
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          fill
          sizes="(max-width: 640px) 205px, 195px"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={getShimmerPlaceholder()}
          priority={priority}
        />

        {/* Hot Badge */}
        {manga.is_hot ? (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-orange-500 text-white border-0 text-xs">
              {t("hot")}
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Nội dung văn bản (Giữ nguyên) */}
      <div className="space-y-0.5 pt-1">
        {/* Title */}
        <h3 className="font-semibold capitalize text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {manga.name}
        </h3>

        {/* Metadata (Chapter) */}
        <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
          {/* Chapter */}
          {manga.latest_chapter ? (
            <p className="truncate" title={manga.latest_chapter.name}>
              {manga.latest_chapter.name}
            </p>
          ) : (
            <span />
          )}
        </div>

        {/* Star Rating */}
        {manga.average_rating > 0 && (
          <div className="flex items-center gap-1">
            <StarRating
              value={manga.average_rating}
              readonly={true}
              size="sm"
              showValue={true}
            />
            {manga.total_ratings && (
              <span className="text-xs text-muted-foreground">
                ({manga.total_ratings})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
});
