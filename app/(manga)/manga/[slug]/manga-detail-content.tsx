"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  Eye,
  Search,
  ArrowUpDown,
  CalendarDays,
  User,
  PawPrint,
} from "lucide-react";
import { useState, useMemo, useCallback, type ComponentType } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { MangaDetailSkeleton } from "@/components/layout/loading/detail-skeleton";
import { BookmarkButton } from "@/components/manga/bookmark-button";
import { CommentSection } from "@/components/comments";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { userFavoritesApi } from "@/lib/api/endpoints/user";
import { useAuthStore } from "@/lib/store/authStore";
import { cn, formatNumber } from "@/lib/utils";
import { useMangaComments, useAddMangaComment } from "@/lib/hooks/use-comments";
import type { Manga } from "@/types/manga";
import type { ChapterListItem } from "@/types/chapter";
import { getShimmerPlaceholder } from "@/lib/utils/image-placeholder";

// --- Sub-components ---

// Component hiển thị thông tin dạng dòng nhỏ gọn
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

const Breadcrumb = ({ name }: { name: string }) => {
  const t = useTranslations("navigation");
  return (
    <nav className="flex items-center text-xs sm:text-sm text-muted-foreground mb-4 overflow-hidden whitespace-nowrap mask-linear-fade">
      <Link href="/" className="hover:text-primary transition-colors">
        {t("home")}
      </Link>
      <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
      <Link href="/manga" className="hover:text-primary transition-colors">
        {t("mangaList")}
      </Link>
      <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
      <span className="font-medium text-foreground truncate">{name}</span>
    </nav>
  );
};

// Component mô tả có nút xem thêm
// Component mô tả có nút xem thêm
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
      .replace(/\n\s*\n/g, "\n\n") // Max 1 empty line between blocks
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

// --- Main Components ---

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
  const tComment = useTranslations("comment");

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [commentSort, setCommentSort] = useState<"asc" | "desc">("desc");
  const [commentPage, setCommentPage] = useState(1);

  const firstChapterSlug =
    manga.first_chapter?.slug || manga.latest_chapter?.slug;

  const filteredChapters = useMemo(() => {
    let result = [...chapters];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.chapter_number.toString().includes(lower)
      );
    }
    result.sort((a, b) =>
      sortOrder === "newest"
        ? b.chapter_number - a.chapter_number
        : a.chapter_number - b.chapter_number
    );
    return result;
  }, [chapters, sortOrder, searchTerm]);

  // Comments hooks - fetch all comments (manga + chapter) for manga detail page
  const { data: commentsData, isLoading: isCommentsLoading } = useMangaComments(
    manga.slug,
    {
      page: commentPage,
      sort: commentSort,
      type: "all",
    }
  );

  const addCommentMutation = useAddMangaComment(manga.slug);

  // Comment handlers
  const handleAddComment = useCallback(
    async (content: string, parentId?: string | null) => {
      try {
        // Ensure parent_id is always either a string or null, never undefined
        await addCommentMutation.mutateAsync({
          content,
          parent_id: parentId ?? null,
        });
        toast.success(tComment("addSuccess"));
      } catch (error) {
        toast.error(tComment("addError"));
        throw error;
      }
    },
    [addCommentMutation, tComment]
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* --- HEADER: SIDE-BY-SIDE LAYOUT (Mobile & Desktop) --- */}
          <div className="flex flex-row gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Left: Cover Image (Fixed widths) */}
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
                  priority // Hero image - always prioritize
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
              {/* Title & Status */}
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

              {/* Stats Grid (Simplified for Mobile) */}
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
                {manga.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground">
                      {Number(manga.average_rating).toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{formatNumber(manga.views)}</span>
                </div>
              </div>

              {/* Author / Group / Updated (Hidden on very small screens if needed, or truncated) */}
              <div className="flex flex-col gap-1 mt-1">
                {manga.artist && (
                  <MetaItem icon={User} text={manga.artist.name} />
                )}
                <MetaItem
                  icon={CalendarDays}
                  text={`${t("detail.updatedAt")}: ${new Date(manga.updated_at).toLocaleDateString("vi-VN")}`}
                />
              </div>

              {/* Tags (Desktop only primarily, limit on mobile) */}
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

              {/* Description Section (Desktop) */}
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
                {/* Read Button */}
                {firstChapterSlug ? (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 sm:flex-none sm:w-32 md:w-40 h-9 font-semibold rounded-full shadow-sm"
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

                {/* Bookmark Button */}
                <BookmarkButton
                  manga={{ id: manga.id, name: manga.name }}
                  initialBookmarked={isBookmarked}
                  size="sm"
                  showText={false}
                  variant="outline"
                  className="h-9 w-9 rounded-full border-muted-foreground/30"
                />
              </div>
            </div>
          </div>

          {/* Description Section (Full Width below header) - Mobile Only */}
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

      <Card>
        <CardContent className="px-4 sm:px-6">
          {/* --- CHAPTER LIST --- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/chibi.svg"
                  alt="Reading"
                  width={30}
                  height={30}
                  className="inline-block"
                />
                {tChapter("chapterList")}
                <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {chapters.length}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative w-32 sm:w-48 transition-all focus-within:w-40 sm:focus-within:w-60">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder={t("detail.searchChapterPlaceholder")}
                    className="pl-8 h-8 text-xs rounded-full bg-secondary/30 border-transparent focus:bg-background focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                  }
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${manga.slug}/${chapter.slug}`}
                    className="flex justify-between py-2.5 border-b border-border/40 hover:bg-secondary/20 hover:pl-2 transition-all duration-200 rounded-sm"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-medium text-foreground/90 group-hover:text-primary truncate">
                        {tChapter("chapter")} {chapter.chapter_number}
                      </div>
                      {chapter.name &&
                        chapter.name !==
                          `Chapter ${chapter.chapter_number}` && (
                          <div className="text-[11px] text-muted-foreground truncate">
                            {chapter.name}
                          </div>
                        )}
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap font-mono">
                      {new Date(chapter.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  {t("detail.noChapters")}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection
        comments={commentsData?.items || []}
        totalCount={commentsData?.pagination.total || 0}
        isLoading={isCommentsLoading}
        sort={commentSort}
        onSortChange={setCommentSort}
        onAddComment={handleAddComment}
        hasMore={
          (commentsData?.pagination.current_page || 1) <
          (commentsData?.pagination.last_page || 1)
        }
        onLoadMore={() => setCommentPage((p) => p + 1)}
      />
    </div>
  );
}

// --- Container wrapper remains same but cleaner imports ---
interface MangaDetailContentProps {
  slug: string;
}

export function MangaDetailContent({ slug }: MangaDetailContentProps) {
  const { isAuthenticated } = useAuthStore();
  const tErrors = useTranslations("errors");

  const {
    data: manga,
    isLoading: isMangaLoading,
    error: mangaError,
  } = useQuery({
    queryKey: ["manga", slug],
    queryFn: () => mangaApi.getDetail(slug),
  });

  const { data: chapters, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["manga", slug, "chapters"],
    queryFn: () => mangaApi.getChapters(slug),
    enabled: !!manga,
  });

  const { data: favoritesData } = useQuery({
    queryKey: ["user", "favorites"],
    queryFn: () => userFavoritesApi.getList({ per_page: 1000 }),
    enabled: isAuthenticated,
  });

  const isBookmarked = useMemo(
    () =>
      manga && favoritesData?.data
        ? favoritesData.data.some((fav) => fav.id === manga.id)
        : false,
    [manga, favoritesData]
  );

  if (isMangaLoading || isChaptersLoading) {
    return <MangaDetailSkeleton />;
  }

  if (mangaError || !manga) {
    return <div className="py-20 text-center">{tErrors("notFound")}</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <Breadcrumb name={manga.name} />
      <MangaDetail
        manga={manga}
        chapters={chapters?.data || []}
        isBookmarked={isBookmarked}
      />
    </div>
  );
}
