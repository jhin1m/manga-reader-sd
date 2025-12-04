"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useCompletedManga, useRemoveBookmark } from "@/lib/hooks/use-library";
import { LibraryMangaCard } from "./library-manga-card";
import { EmptyState } from "./empty-state";
import { TabContentSkeleton } from "./library-skeleton";

export function CompletedTab() {
  const t = useTranslations("user.library");
  const tNotify = useTranslations("notifications");

  const { data, isLoading, error } = useCompletedManga();
  const removeMutation = useRemoveBookmark();

  const handleRemove = async (mangaId: number, mangaName: string) => {
    try {
      await removeMutation.mutateAsync(mangaId);
      toast.success(tNotify("bookmarkRemoved"), {
        description: mangaName,
      });
    } catch {
      toast.error(t("errors.removeFailed"));
    }
  };

  if (isLoading) {
    return <TabContentSkeleton showStats gridCount={10} />;
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
        variant="completed"
        title={t("emptyStates.completed.title")}
        description={t("emptyStates.completed.description")}
        actionLabel={t("emptyStates.completed.action")}
        actionHref="/library?tab=bookmarks"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        {t("stats.totalCompleted", { count: data.items.length })}
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.items.map((manga) => (
          <LibraryMangaCard
            key={manga.id}
            manga={manga}
            showRemove
            onRemove={() => handleRemove(manga.id, manga.name)}
            isRemoving={removeMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
