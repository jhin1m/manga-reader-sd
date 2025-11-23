"use client";

/**
 * RecentlyUpdatedSection Component
 * Displays recently updated manga in a grid with header and pagination
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock } from "lucide-react";

import { mangaApi } from "@/lib/api/endpoints/manga";
import { MangaGrid } from "./manga-grid";
import { Pagination } from "@/components/ui/pagination";

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
      }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Optional: Scroll to top of section or page
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">
            {t("recentlyUpdated")}
          </h2>
        </div>
        <Link
          href="/recent"
          className="text-sm text-primary hover:underline font-medium"
        >
          {t("viewAll")} →
        </Link>
      </div>

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
    </section>
  );
}
