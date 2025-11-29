"use client";

/**
 * MangaCard Component
 * Reusable card component for displaying manga with cover, title, and metadata
 * Used in grids, lists, and carousels throughout the application
 */

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

import type { MangaListItem } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";

export interface MangaCardProps {
  manga: MangaListItem;
  className?: string;
  priority?: boolean;
}

/**
 * MangaCard component for displaying individual manga items
 * Minimalist design with essential information only
 *
 * @param manga - Manga data to display
 * @param className - Optional additional CSS classes
 * @param priority - Whether to prioritize loading this image (for above-the-fold content)
 */
export function MangaCard({
  manga,
  className,
  priority = false,
}: MangaCardProps) {
  const t = useTranslations("homepage.mangaCard");

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className={cn("group flex flex-col space-y-1.5", className)}
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
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Hot Badge */}
        {manga.is_hot ? (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-orange-500 text-white border-0 text-xs">
              {t("hot")}
            </Badge>
          </div>
        ) : null}

        {/* Views Counter */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 rounded-sm bg-black/60 px-1.5 py-0.5 text-xs text-white">
          <Eye className="h-3 w-3" />
          <span>{formatNumber(manga.views)}</span>
        </div>
      </div>

      {/* Nội dung văn bản (Giữ nguyên) */}
      <div className="space-y-0.5 pt-1">
        {/* Title */}
        <h3 className="font-semibold capitalize text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {manga.name}
        </h3>

        {/* Metadata (Chapter + Rating) */}
        <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
          {/* Chapter */}
          {manga.latest_chapter ? (
            <p className="truncate" title={manga.latest_chapter.name}>
              {manga.latest_chapter.name}
            </p>
          ) : (
            <span />
          )}

          {/* Rating */}
          {Boolean(manga.average_rating) && manga.average_rating > 0 ? (
            <div className="flex flex-shrink-0 items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{Number(manga.average_rating).toFixed(1)}</span>
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </Link>
  );
}
