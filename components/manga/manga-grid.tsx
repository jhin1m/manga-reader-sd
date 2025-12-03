"use client";

/**
 * MangaGrid Component
 * Responsive grid layout for displaying manga cards
 * Includes loading skeleton and empty state
 */

import { useTranslations } from "next-intl";

import type { MangaListItem } from "@/types/manga";
import { MangaCard } from "./manga-card";
import { MangaGridSkeleton } from "@/components/layout/loading";
import { cn } from "@/lib/utils";

export interface MangaGridProps {
  mangas: MangaListItem[];
  className?: string;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * MangaGrid component for displaying manga in a responsive grid layout
 *
 * @param mangas - Array of manga items to display
 * @param className - Optional additional CSS classes
 * @param isLoading - Whether the grid is in loading state
 * @param emptyMessage - Custom message to display when no manga found
 * @param columns - Custom column configuration for different breakpoints
 */
export function MangaGrid({
  mangas,
  className,
  isLoading = false,
  emptyMessage,
  columns = {
    default: 3,
    sm: 3,
    md: 4,
    lg: 5,
  },
}: MangaGridProps) {
  const t = useTranslations("homepage.emptyStates");

  // Generate grid classes based on column configuration
  const gridClasses = cn(
    "grid gap-4",
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  if (isLoading) {
    return <MangaGridSkeleton className={gridClasses} count={12} />;
  }

  if (mangas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage || t("noManga")}
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {mangas.map((manga, index) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
