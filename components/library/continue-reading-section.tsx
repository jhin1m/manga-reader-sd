"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MangaStatus } from "@/types/manga";

import { useContinueReading } from "@/lib/hooks/use-library";
import { LibraryMangaCard } from "./library-manga-card";
import { EmptyState } from "./empty-state";
import { ContinueReadingSkeleton } from "./library-skeleton";
import { Button } from "@/components/ui/button";
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

export function ContinueReadingSection() {
  const t = useTranslations("user.library");
  const { data, isLoading, error } = useContinueReading();

  if (isLoading) {
    return <ContinueReadingSkeleton />;
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
        variant="continue"
        title={t("emptyStates.continue.title")}
        description={t("emptyStates.continue.description")}
        actionLabel={t("emptyStates.continue.action")}
        actionHref="/manga"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid of continue reading items */}
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
          />
        ))}
      </div>

      {/* View All link if there are more items */}
      {data.hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/library?tab=history" className="gap-2">
              {t("viewAllHistory")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
