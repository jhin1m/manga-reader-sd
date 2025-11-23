"use client";

/**
 * Browse Content Component
 * Client component for browse page with filters, manga grid, and pagination
 */

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { BrowseFilterBar, type FilterValues } from "@/components/browse";
import { MangaGrid } from "@/components/manga/manga-grid";
import { Pagination } from "@/components/ui/pagination";
import type { SortOption } from "@/components/browse/sort-select";
import type { MangaListParams } from "@/types/manga";
import { formatNumber } from "@/lib/utils";

interface BrowseContentProps {
  searchParams: {
    page?: string;
    status?: string;
    sort?: string;
    q?: string;
  };
}

/**
 * Parse URL search params into filter values
 */
function parseSearchParams(searchParams: BrowseContentProps["searchParams"]): {
  filters: FilterValues;
  page: number;
} {
  return {
    filters: {
      search: searchParams.q || "",
      status: searchParams.status || "all",
      sort: (searchParams.sort as SortOption) || "-updated_at",
    },
    page: parseInt(searchParams.page || "1", 10),
  };
}

/**
 * Build API params from filter values and page
 */
function buildApiParams(filters: FilterValues, page: number): MangaListParams {
  const params: MangaListParams = {
    page,
    per_page: 24,
    sort: filters.sort,
    include: "genres,artist,latest_chapter",
  };

  if (filters.search) {
    params["filter[name]"] = filters.search;
  }

  if (filters.status && filters.status !== "all") {
    params["filter[status]"] = parseInt(filters.status, 10) as 1 | 2;
  }

  return params;
}

/**
 * Build URL with filter params
 */
function buildUrl(filters: FilterValues, page: number): string {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.sort !== "-updated_at") {
    params.set("sort", filters.sort);
  }

  if (filters.search) {
    params.set("q", filters.search);
  }

  const queryString = params.toString();
  return queryString ? `/browse?${queryString}` : "/browse";
}

/**
 * Browse content component with filters and pagination
 */
export function BrowseContent({ searchParams }: BrowseContentProps) {
  const t = useTranslations("browse");
  const router = useRouter();

  // Parse values from URL
  const { filters, page } = parseSearchParams(searchParams);

  // Fetch manga list
  const { data, isLoading, error } = useQuery({
    queryKey: ["manga-list", filters, page],
    queryFn: () => mangaApi.getList(buildApiParams(filters, page)),
  });

  // Handle filter apply
  const handleApplyFilters = (newFilters: FilterValues) => {
    router.push(buildUrl(newFilters, 1));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    router.push(buildUrl(filters, newPage));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mangas = data?.data || [];
  const pagination = data?.meta?.pagination;
  const totalPages = pagination?.last_page || 1;
  const totalCount = pagination?.total || 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {!isLoading && totalCount > 0 && (
          <p className="text-muted-foreground">
            {t("totalResults", { count: formatNumber(totalCount) })}
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <BrowseFilterBar initialValues={filters} onApply={handleApplyFilters} />

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">{t("noResults")}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("noResultsDescription")}
          </p>
        </div>
      )}

      {/* Manga Grid */}
      {!error && (
        <>
          <MangaGrid
            mangas={mangas}
            isLoading={isLoading}
            emptyMessage={
              <div className="text-center">
                <p className="text-lg font-medium">{t("noResults")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("noResultsDescription")}
                </p>
              </div>
            }
          />

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}
