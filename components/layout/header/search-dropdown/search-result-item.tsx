"use client";

/**
 * SearchResultItem Component
 * Individual search result with thumbnail, title, and latest chapter
 */

import Image from "next/image";
import Link from "next/link";

import type { MangaListItem } from "@/types/manga";
import { cn } from "@/lib/utils";

export interface SearchResultItemProps {
  manga: MangaListItem;
  isSelected: boolean;
  index: number;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function SearchResultItem({
  manga,
  isSelected,
  index,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  return (
    <Link
      href={`/manga/${manga.slug}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      id={`search-result-${index}`}
      className={cn(
        "flex items-start gap-3 p-2 border-b last:border-b-0",
        "transition-colors duration-200",
        "hover:bg-accent/50 focus:bg-accent/50 focus:outline-none",
        isSelected && "bg-accent"
      )}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-14 h-20 bg-muted rounded-sm overflow-hidden">
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Title */}
        <h4 className="font-semibold text-sm line-clamp-2 leading-snug mb-1">
          {manga.name}
        </h4>

        {/* Latest Chapter */}
        {manga.latest_chapter && (
          <p className="text-xs text-muted-foreground truncate">
            {manga.latest_chapter.name}
          </p>
        )}
      </div>
    </Link>
  );
}
