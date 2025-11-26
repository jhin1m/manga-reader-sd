"use client";

/**
 * MangaCarouselCard Component
 * Specialized card component for carousel display
 * Features: Gradient overlay at bottom with title and chapter info inside the image
 */

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

import type { MangaListItem } from "@/types/manga";
import { Eye, Star } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";

export interface MangaCarouselCardProps {
  manga: MangaListItem;
  className?: string;
  priority?: boolean;
}

/**
 * MangaCarouselCard component for displaying manga in carousels
 * Optimized for carousel display with overlay gradient and text inside image
 *
 * @param manga - Manga data to display
 * @param className - Optional additional CSS classes
 * @param priority - Whether to prioritize loading this image (for above-the-fold content)
 */
export function MangaCarouselCard({
  manga,
  className,
  priority = false,
}: MangaCarouselCardProps) {
  const t = useTranslations("homepage.mangaCard");

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-lg",
          "border-2 border-chart-2",
          "transition-shadow duration-200",
          "hover:shadow-lg hover:border-primary"
        )}
      >
        {/* Cover Image */}
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
        />

        {/* Gradient Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        {/* Views Counter */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
          <Eye className="h-3 w-3" />
          <span>{formatNumber(manga.views)}</span>
        </div>

        {/* Text Content - Inside Image with Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 space-y-1">
          {/* Title */}
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 capitalize">
            {manga.name}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Latest Chapter */}
            {manga.latest_chapter ? (
              <p
                className="text-gray-200 truncate"
                title={manga.latest_chapter.name}
              >
                {manga.latest_chapter.name}
              </p>
            ) : (
              <span className="text-gray-400 text-xs">{t("noChapter")}</span>
            )}

            {/* Rating */}
            {manga.average_rating > 0 && (
              <div className="flex flex-shrink-0 items-center gap-0.5 bg-yellow-500 rounded-full px-1.5 py-0.5">
                <Star className="h-2.5 w-2.5 fill-white text-white" />
                <span className="font-semibold text-white text-xs">
                  {manga.average_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
