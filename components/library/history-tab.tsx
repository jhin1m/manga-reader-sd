"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useHistory, useRemoveFromHistory } from "@/lib/hooks/use-library";
import { LibraryMangaCard } from "./library-manga-card";
import { EmptyState } from "./empty-state";
import { TabContentSkeleton } from "./library-skeleton";
import { LibraryPagination } from "./library-pagination";
import { MangaStatus } from "@/types/manga";
import type { MangaReference } from "@/types/chapter";
import type { MangaListItem } from "@/types/manga";

// Helper function to safely transform MangaReference to MangaListItem
function transformMangaReferenceToMangaListItem(
  mangaRef: MangaReference,
  lastReadAt: string
): MangaListItem {
  return {
    id: mangaRef.id,
    uuid: mangaRef.uuid,
    name: mangaRef.name,
    name_alt: mangaRef.name_alt,
    slug: mangaRef.slug,
    cover_full_url: mangaRef.cover_full_url,
    status: MangaStatus.ONGOING, // Default to ongoing since we don't have this info
    views: 0,
    views_week: undefined,
    views_day: undefined,
    average_rating: 0,
    is_hot: false,
    updated_at: lastReadAt,
    genres: undefined,
    artist: undefined,
    latest_chapter: undefined,
  };
}

export function HistoryTab() {
  const t = useTranslations("user.library");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, error } = useHistory({ page, per_page: perPage });
  const removeMutation = useRemoveFromHistory();

  const handleRemove = async (mangaId: number, mangaName: string) => {
    try {
      await removeMutation.mutateAsync(mangaId);
      toast.success(t("historyRemoved"), {
        description: mangaName,
      });
    } catch {
      toast.error(t("errors.removeFailed"));
    }
  };

  if (isLoading) {
    return <TabContentSkeleton showStats gridCount={perPage} />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        {t("errors.loadFailed")}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        variant="history"
        title={t("emptyStates.history.title")}
        description={t("emptyStates.history.description")}
        actionLabel={t("emptyStates.history.action")}
        actionHref="/manga"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        {t("stats.totalHistory", { count: data.pagination.total })}
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.items.map((item) => (
          <LibraryMangaCard
            key={item.manga.id}
            manga={transformMangaReferenceToMangaListItem(
              item.manga,
              item.last_read_at
            )}
            lastReadChapter={item.last_read_chapter}
            lastReadAt={item.last_read_at}
            showRemove
            onRemove={() => handleRemove(item.manga.id, item.manga.name)}
            isRemoving={removeMutation.isPending}
          />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.last_page > 1 && (
        <LibraryPagination
          currentPage={page}
          totalPages={data.pagination.last_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
