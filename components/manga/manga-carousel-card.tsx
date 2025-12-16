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
import { cn } from "@/lib/utils";
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";

export interface MangaCarouselCardProps {
  manga: MangaListItem;
  className?: string;
}

/**
 * MangaCarouselCard component for displaying manga in carousels
 * Optimized for carousel display with overlay gradient and text inside image
 *
 * @param manga - Manga data to display
 * @param className - Optional additional CSS classes
 */
export function MangaCarouselCard({
  manga,
  className,
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
          "transition-shadow duration-200",
          "hover:shadow-lg hover:border-primary"
        )}
      >
        {/* Cover Image */}
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={getShimmerPlaceholder()}
        />

        {/* Gradient Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

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
          </div>
        </div>
      </div>
    </Link>
  );
}
