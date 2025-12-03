"use client";

/**
 * MangaCard Component
 * Reusable card component for displaying manga with cover, title, and metadata
 * Used in grids, lists, and carousels throughout the application
 */

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { MangaListItem } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MangaCardProps {
  manga: MangaListItem;
  className?: string;
}

/**
 * MangaCard component for displaying individual manga items
 * Minimalist design with essential information only
 *
 * @param manga - Manga data to display
 * @param className - Optional additional CSS classes
 */
export function MangaCard({ manga, className }: MangaCardProps) {
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
        <img
          src={manga.cover_full_url}
          alt={manga.name}
          className="absolute inset-0 w-full h-full object-cover"
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
        </div>
      </div>
    </Link>
  );
}
