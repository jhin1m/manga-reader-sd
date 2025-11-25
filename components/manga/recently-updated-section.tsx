"use client";

/**
 * RecentlyUpdatedSection Component
 * Displays recently updated manga in a grid with header and pagination
 */

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { mangaApi } from "@/lib/api/endpoints/manga";
import { MangaGrid } from "./manga-grid";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RecentlyUpdatedSectionProps {
  perPage?: number;
  className?: string;
}

/**
 * RecentlyUpdatedSection component
 * Fetches and displays recently updated manga using the main mangas API
 *
 * @param perPage - Number of manga items to fetch (default: 24)
 * @param className - Optional additional CSS classes
 */
export function RecentlyUpdatedSection({
  perPage = 24,
  className,
}: RecentlyUpdatedSectionProps) {
  const t = useTranslations("homepage.sections");
  const tEmpty = useTranslations("homepage.emptyStates");
  const sectionRef = useRef<HTMLDivElement>(null);

  // State for pagination
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "mangas",
      "list",
      { page, sort: "-updated_at", per_page: perPage },
    ],
    queryFn: () =>
      mangaApi.getList({
        page,
        per_page: perPage,
        sort: "-updated_at",
        include: "genres,artist,latest_chapter",
      }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    if (sectionRef.current) {
      const yOffset = -100; // Offset for header
      const element = sectionRef.current;
      const targetY =
        element.getBoundingClientRect().top + window.scrollY + yOffset;

      // Custom smooth scroll function for slower speed and better reliability
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 800; // ms
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;

        // Ease out cubic function for smooth deceleration
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startY + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <Card ref={sectionRef} className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌇</span>
          <CardTitle className="text-2xl font-bold">
            {t("recentlyUpdated")}
          </CardTitle>
        </div>
        <Link
          href="/browse"
          className="text-sm text-primary hover:underline font-medium"
        >
          {t("viewAll")} →
        </Link>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">{tEmpty("loadError")}</p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {!error && (
          <>
            <MangaGrid
              mangas={data?.data || []}
              isLoading={isLoading}
              emptyMessage={tEmpty("noManga")}
            />

            {data?.meta?.pagination && data.meta.pagination.last_page > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={data.meta.pagination.last_page}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
