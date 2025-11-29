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
import { Card } from "@/components/ui/card";
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
      <Card
        className={cn(
          "overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200", // Class cũ của Card
          "relative aspect-[3/4] bg-muted" // Class của div bên trong
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

        {/* Hot Badge (Giữ nguyên, vẫn là con của Card) */}
        {manga.is_hot && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-orange-500 text-white border-0 text-xs">
              {t("hot")}
            </Badge>
          </div>
        )}

        {/* Views (mắt xem) (Giữ nguyên, vẫn là con của Card) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 rounded-sm bg-black/60 px-1.5 py-0.5 text-xs text-white">
          <Eye className="h-3 w-3" />
          <span>{formatNumber(manga.views)}</span>
        </div>
      </Card>

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
          {manga.average_rating > 0 && (
            <div className="flex flex-shrink-0 items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{Number(manga.average_rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
