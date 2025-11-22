"use client";

/**
 * Manga Detail Content Component
 * Fetches and displays manga detail page content
 */

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  Eye,
  Calendar,
  Search,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookmarkButton } from "@/components/manga/bookmark-button";
import { MangaDetailSkeleton } from "@/components/layout/loading";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { userFavoritesApi } from "@/lib/api/endpoints/user";
import { useAuthStore } from "@/lib/store/authStore";
import { cn, formatNumber } from "@/lib/utils";
import type { Manga } from "@/types/manga";
import type { ChapterListItem } from "@/types/chapter";

interface MangaDetailContentProps {
  slug: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center space-x-2">
          <Link
            href={item.url}
            className={cn(
              "hover:text-primary",
              index === items.length - 1 && "font-semibold text-primary"
            )}
          >
            {item.name}
          </Link>
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
}

interface MangaDetailProps {
  manga: Manga;
  chapters: ChapterListItem[];
  isBookmarked?: boolean;
}

function MangaDetail({
  manga,
  chapters,
  isBookmarked = false,
}: MangaDetailProps) {
  const t = useTranslations("manga");
  const tCommon = useTranslations("common");
  const tChapter = useTranslations("chapter");

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const statusText =
    manga.status === 1 ? t("status.ongoing") : t("status.completed");

  const firstChapterSlug =
    manga.first_chapter?.slug || manga.latest_chapter?.slug;

  const filteredAndSortedChapters = useMemo(() => {
    const filtered = chapters.filter(
      (chapter) =>
        chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.chapter_number.toString().includes(searchTerm)
    );

    const sorted = [...filtered];
    if (sortOrder === "newest") {
      sorted.sort((a, b) => b.chapter_number - a.chapter_number);
    } else {
      sorted.sort((a, b) => a.chapter_number - b.chapter_number);
    }
    return sorted;
  }, [chapters, sortOrder, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Background blur overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={manga.cover_full_url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-2xl opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-card/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-lg sm:w-56 md:w-52 lg:w-56">
                <Image
                  src={manga.cover_full_url}
                  alt={manga.name}
                  fill
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 208px, 224px"
                  className="object-cover"
                  priority
                />
                {manga.is_hot && (
                  <Badge
                    variant="destructive"
                    className="absolute right-2 top-2 text-xs font-semibold"
                  >
                    {t("hot")}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {firstChapterSlug ? (
                  <Button asChild size="lg" className="flex-1">
                    <Link href={`/manga/${manga.slug}/${firstChapterSlug}`}>
                      {tCommon("readNow")}
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" disabled className="flex-1">
                    {tCommon("readNow")}
                  </Button>
                )}
                <BookmarkButton
                  manga={{ id: manga.id, name: manga.name }}
                  initialBookmarked={isBookmarked}
                  size="lg"
                  showText={false}
                  variant="default"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="text-center md:text-left">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {manga.name}
                </h1>
                {manga.name_alt && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("alternativeTitle")}: {manga.name_alt}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:justify-start">
                <Badge
                  variant={manga.status === 1 ? "default" : "secondary"}
                  className={cn(
                    manga.status === 1 && "bg-green-500 hover:bg-green-600"
                  )}
                >
                  {statusText}
                </Badge>
                {manga.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {manga.average_rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({formatNumber(manga.total_ratings)})
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatNumber(manga.views)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:justify-start">
                {manga.artist && (
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      {t("artist")}:{" "}
                    </span>
                    <span>{manga.artist.name}</span>
                  </div>
                )}
                {manga.group && (
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      {t("translationGroup")}:{" "}
                    </span>
                    <span>{manga.group.name}</span>
                  </div>
                )}
              </div>

              {manga.genres && manga.genres.length > 0 && (
                <div className="text-center md:text-left">
                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {manga.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary" asChild>
                        <Link
                          href={`/genres/${genre.slug}`}
                          className="cursor-pointer px-4 py-2 text-sm font-semibold border-2 border-primary/20 hover:border-primary/40 hover:bg-secondary transition-all"
                        >
                          {genre.name}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {manga.pilot && (
            <div className="mt-6">
              <h2 className="mb-3 text-lg font-semibold">{t("description")}</h2>
              <div
                className="prose prose-sm prose-neutral max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: manga.pilot }}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {tChapter("chapterList")} ({chapters.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("detail.searchChapter")}
                  className="pl-10 w-full sm:w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="transition-transform hover:scale-110 flex-shrink-0"
                title={
                  sortOrder === "newest"
                    ? t("detail.sortOldest")
                    : t("detail.sortNewest")
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {chapters.length > 0 && (
            <div className="max-h-[500px] overflow-y-auto pr-2">
              <div className="space-y-2">
                {filteredAndSortedChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${manga.slug}/${chapter.slug}`}
                    className="flex items-center justify-between rounded-lg border bg-background/50 p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {tChapter("chapter")} {chapter.chapter_number}
                        {chapter.name &&
                          chapter.name !==
                            `Chapter ${chapter.chapter_number}` && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              - {chapter.name}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatNumber(chapter.views)}</span>
                      </div>
                      <div className="hidden items-center gap-1 sm:flex">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(chapter.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {chapters.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{t("noResults")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export function MangaDetailContent({ slug }: MangaDetailContentProps) {
  const tErrors = useTranslations("errors");
  const { isAuthenticated } = useAuthStore();

  const {
    data: manga,
    isLoading: isMangaLoading,
    error: mangaError,
  } = useQuery({
    queryKey: ["manga", slug],
    queryFn: () => mangaApi.getDetail(slug),
  });

  const {
    data: chapters,
    isLoading: isChaptersLoading,
    error: chaptersError,
  } = useQuery({
    queryKey: ["manga", slug, "chapters"],
    queryFn: () => mangaApi.getChapters(slug),
    enabled: !!manga,
  });

  const { data: favoritesData } = useQuery({
    queryKey: ["user", "favorites"],
    queryFn: () => userFavoritesApi.getList({ per_page: 1000 }),
    enabled: isAuthenticated,
  });

  const isBookmarked =
    manga && favoritesData?.data
      ? favoritesData.data.some((fav) => fav.id === manga.id)
      : false;

  if (isMangaLoading || isChaptersLoading) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <MangaDetailSkeleton />
      </div>
    );
  }

  if (mangaError || !manga) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold text-destructive">
              {tErrors("notFound")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {tErrors("pageNotFoundDescription")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chaptersError) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{tErrors("general")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Manga", url: "/manga" },
    { name: manga.name, url: `/manga/${manga.slug}` },
  ];

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mt-6">
        <MangaDetail
          manga={manga}
          chapters={chapters || []}
          isBookmarked={isBookmarked}
        />
      </div>
    </div>
  );
}
