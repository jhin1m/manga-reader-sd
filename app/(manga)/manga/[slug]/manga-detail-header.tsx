"use client";

/**
 * Manga detail header section - cover image, title, stats, genres, description, actions
 * Extracted from manga-detail-content.tsx for modularity
 */

import { useState, useMemo, useCallback, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  Eye,
  CalendarDays,
  User,
  PawPrint,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkButton } from "@/components/manga/bookmark-button";
import { StarRating } from "@/components/manga/star-rating";
import { cn, formatNumber } from "@/lib/utils";
import {
  getShimmerPlaceholder,
  isUnoptimizedImage,
} from "@/lib/utils/image-placeholder";
import { useReadingProgressStore } from "@/lib/store/readingProgressStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRateManga } from "@/lib/hooks/use-rating";
import { toast } from "sonner";
import type { Manga } from "@/types/manga";
import type { ChapterListItem } from "@/types/chapter";

// --- Small helper components ---

interface MetaItemProps {
  icon: ComponentType<{ className?: string }>;
  text: string;
  className?: string;
}

const MetaItem = ({ icon: Icon, text, className }: MetaItemProps) => (
  <div
    className={cn(
      "flex items-center gap-1.5 text-xs text-muted-foreground",
      className
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    <span className="line-clamp-1">{text}</span>
  </div>
);

export function Breadcrumb({ name }: { name: string }) {
  const t = useTranslations("navigation");
  return (
    <nav className="flex items-center text-xs sm:text-sm text-muted-foreground mb-4 overflow-hidden whitespace-nowrap mask-linear-fade">
      <Link href="/" className="hover:text-primary transition-colors">
        {t("home")}
      </Link>
      <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
      <Link href="/browse" className="hover:text-primary transition-colors">
        {t("mangaList")}
      </Link>
      <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
      <span className="font-medium text-foreground truncate">{name}</span>
    </nav>
  );
}

const ExpandableDescription = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("manga.detail");

  const cleanContent = useMemo(() => {
    if (!content) return "";
    return content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();
  }, [content]);

  if (!cleanContent) return null;

  return (
    <div className="group relative mt-3">
      <div
        className={cn(
          "text-sm text-muted-foreground whitespace-pre-line leading-normal overflow-hidden",
          !isExpanded && "line-clamp-3"
        )}
      >
        {cleanContent}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {isExpanded ? t("showLess") : t("showMore")}
      </button>
    </div>
  );
};

// --- Main header component ---

interface MangaDetailHeaderProps {
  manga: Manga;
  chapters: ChapterListItem[];
}

export function MangaDetailHeader({ manga, chapters }: MangaDetailHeaderProps) {
  const t = useTranslations("manga");
  const tCommon = useTranslations("common");
  const tRating = useTranslations("rating");

  const { isAuthenticated } = useAuthStore();
  const rateMutation = useRateManga(manga.slug);

  const readingProgress = useReadingProgressStore((s) =>
    s.getProgress(manga.slug)
  );

  const firstChapterSlug = useMemo(() => {
    if (manga.first_chapter?.slug) return manga.first_chapter.slug;
    if (chapters.length > 0) {
      const sortedChapters = [...chapters].sort(
        (a, b) => a.chapter_number - b.chapter_number
      );
      return sortedChapters[0]?.slug;
    }
    return manga.latest_chapter?.slug;
  }, [manga.first_chapter, manga.latest_chapter, chapters]);

  const handleRate = useCallback(
    async (rating: number) => {
      if (!isAuthenticated) {
        toast.error(tRating("loginRequired"));
        return;
      }
      try {
        await rateMutation.mutateAsync(rating);
        toast.success(tRating("success"));
      } catch {
        toast.error(tRating("error"));
      }
    },
    [isAuthenticated, rateMutation, tRating]
  );

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* HEADER: SIDE-BY-SIDE LAYOUT */}
        <div className="flex flex-row gap-4 sm:gap-6 md:gap-8 items-start">
          {/* Left: Cover Image */}
          <div className="shrink-0 w-[110px] sm:w-[150px] md:w-[220px]">
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md">
              <Image
                src={manga.cover_full_url}
                alt={manga.name}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                style={{ objectFit: "cover" }}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder()}
                priority
                unoptimized={isUnoptimizedImage(manga.cover_full_url)}
              />
              {manga.is_hot && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 left-1 px-1.5 py-0 text-[10px] uppercase"
                >
                  Hot
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Info Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
            <div>
              <h1
                className="text-lg sm:text-2xl md:text-4xl font-bold leading-tight text-foreground line-clamp-2 md:line-clamp-3"
                title={manga.name}
              >
                {manga.name}
              </h1>
              {manga.name_alt && (
                <p className="hidden sm:block text-sm text-muted-foreground mt-1 truncate">
                  {manga.name_alt}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "relative flex h-2 w-2",
                    manga.status === 1 ? "text-green-500" : "text-blue-500"
                  )}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
                <span className="font-medium text-foreground">
                  {manga.status === 1
                    ? t("status.completed")
                    : t("status.ongoing")}
                </span>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {manga.average_rating > 0 && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground">
                      {Number(manga.average_rating).toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({manga.total_ratings || 0})
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <StarRating
                    value={rateMutation.data?.rating.rating}
                    onChange={handleRate}
                    isLoading={rateMutation.isPending}
                    size="sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span>{formatNumber(manga.views)}</span>
              </div>
            </div>

            {/* Author / Updated */}
            <div className="flex flex-col gap-1 mt-1">
              {manga.artist && (
                <MetaItem icon={User} text={manga.artist.name} />
              )}
              <MetaItem
                icon={CalendarDays}
                text={`${t("detail.updatedAt")}: ${new Date(manga.updated_at).toLocaleDateString("vi-VN")}`}
              />
            </div>

            {/* Tags (Desktop) */}
            {manga.genres && (
              <div className="hidden sm:flex flex-wrap gap-1.5 mt-2">
                {manga.genres.slice(0, 5).map((g) => (
                  <Badge
                    key={g.id}
                    variant="secondary"
                    className="text-[10px] px-1.5 h-5 font-normal hover:bg-secondary-foreground/10 cursor-pointer"
                  >
                    {g.name}
                  </Badge>
                ))}
                {manga.genres.length > 5 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 h-5 font-normal"
                  >
                    + {manga.genres.length - 5}
                  </Badge>
                )}
              </div>
            )}

            {/* Description (Desktop) */}
            {manga.pilot && (
              <div className="hidden sm:block mt-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
                  {t("detail.introduction")}
                </h3>
                <ExpandableDescription content={manga.pilot} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-auto pt-2">
              {readingProgress && (
                <Button
                  asChild
                  size="sm"
                  className="flex-1 sm:flex-none sm:w-32 md:w-40 h-9 font-semibold rounded-full shadow-sm"
                >
                  <Link
                    href={`/manga/${manga.slug}/${readingProgress.chapterSlug}`}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">
                      {t("detail.continueReading")}
                    </span>
                  </Link>
                </Button>
              )}

              {firstChapterSlug ? (
                <Button
                  asChild
                  size="sm"
                  variant={readingProgress ? "outline" : "default"}
                  className={cn(
                    "flex-1 sm:flex-none h-9 font-semibold rounded-full",
                    readingProgress ? "sm:w-auto" : "sm:w-32 md:w-40 shadow-sm"
                  )}
                >
                  <Link href={`/manga/${manga.slug}/${firstChapterSlug}`}>
                    <PawPrint className="mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">
                      {tCommon("readNow")}
                    </span>
                  </Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled
                  className="flex-1 sm:flex-none h-9 rounded-full"
                >
                  {tCommon("readNow")}
                </Button>
              )}

              <BookmarkButton
                manga={{ id: manga.id, name: manga.name }}
                size="sm"
                showText={false}
                variant="outline"
                className="h-9 w-9 rounded-full border-muted-foreground/30"
              />
            </div>
          </div>
        </div>

        {/* Genres - Mobile Only */}
        {manga.genres && manga.genres.length > 0 && (
          <div className="mt-4 sm:hidden">
            <div className="flex flex-wrap gap-1.5">
              {manga.genres.slice(0, 5).map((g) => (
                <Badge
                  key={g.id}
                  variant="secondary"
                  className="text-[10px] px-1.5 h-5 font-normal hover:bg-secondary-foreground/10 cursor-pointer"
                >
                  {g.name}
                </Badge>
              ))}
              {manga.genres.length > 5 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 h-5 font-normal"
                >
                  + {manga.genres.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Description - Mobile Only */}
        {manga.pilot && (
          <div className="mt-6 sm:hidden">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
              {t("detail.introduction")}
            </h3>
            <ExpandableDescription content={manga.pilot} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
