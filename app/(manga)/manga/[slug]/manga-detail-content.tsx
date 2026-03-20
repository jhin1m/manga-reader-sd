"use client";

/**
 * Manga Detail Content - Container component
 * Orchestrates data fetching and renders header, chapters, and comments sections
 */

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { mangaApi } from "@/lib/api/endpoints/manga";
import { mangaKeys } from "@/lib/api/query-keys";
import { MangaDetailSkeleton } from "@/components/layout/loading/detail-skeleton";
import { CommentsSkeleton } from "@/components/comments/comments-skeleton";
import { LazyCommentWrapper } from "@/components/comments/lazy-comment-wrapper";
import { useMangaComments, useAddMangaComment } from "@/lib/hooks/use-comments";
import { useReadingProgressStore } from "@/lib/store/readingProgressStore";
import { STALE_TIMES } from "@/lib/constants";
import { Breadcrumb, MangaDetailHeader } from "./manga-detail-header";
import { MangaChapterList } from "./manga-chapter-list";

// Dynamic import for CommentSection - reduces initial bundle size
const CommentSection = dynamic(
  () =>
    import("@/components/comments/comment-section").then((mod) => ({
      default: mod.CommentSection,
    })),
  {
    loading: () => <CommentsSkeleton />,
    ssr: false,
  }
);

interface MangaDetailContentProps {
  slug: string;
}

const CHAPTERS_PER_PAGE = 999;

export function MangaDetailContent({ slug }: MangaDetailContentProps) {
  const tErrors = useTranslations("errors");
  const tComment = useTranslations("comment");

  // Chapter sort order state
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [commentSort, setCommentSort] = useState<"asc" | "desc">("desc");
  const [commentPage, setCommentPage] = useState(1);

  // Reading progress
  const readingProgress = useReadingProgressStore((s) => s.getProgress(slug));

  // Manga detail query - uses hydrated data from server prefetch
  const {
    data: manga,
    isLoading: isMangaLoading,
    error: mangaError,
  } = useQuery({
    queryKey: mangaKeys.detail(slug),
    queryFn: () => mangaApi.getDetail(slug),
  });

  // Chapters query
  const { data: chaptersResponse, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["manga", slug, "chapters", sortOrder],
    queryFn: () =>
      mangaApi.getChapters(slug, {
        per_page: CHAPTERS_PER_PAGE,
        sort: sortOrder === "newest" ? "desc" : "asc",
      }),
    enabled: !!manga,
    staleTime: STALE_TIMES.LONG,
  });

  const chapters = chaptersResponse?.data || [];

  const handleSortOrderChange = useCallback((order: "newest" | "oldest") => {
    setSortOrder(order);
  }, []);

  // Comments
  const { data: commentsData, isLoading: isCommentsLoading } = useMangaComments(
    slug,
    { page: commentPage, sort: commentSort, type: "all" }
  );

  const addCommentMutation = useAddMangaComment(slug);

  const handleAddComment = useCallback(
    async (content: string, parentId?: string | null) => {
      try {
        await addCommentMutation.mutateAsync({
          content,
          parent_id: parentId ?? null,
        });
        toast.success(tComment("addSuccess"));
      } catch {
        toast.error(tComment("addError"));
      }
    },
    [addCommentMutation, tComment]
  );

  if (isMangaLoading) {
    return <MangaDetailSkeleton />;
  }

  if (mangaError || !manga) {
    return <div className="py-20 text-center">{tErrors("notFound")}</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <Breadcrumb name={manga.name} />

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header: cover, info, stats, actions */}
        <MangaDetailHeader manga={manga} chapters={chapters} />

        {/* Chapter List */}
        <MangaChapterList
          mangaSlug={manga.slug}
          chapters={chapters}
          isLoading={isChaptersLoading}
          sortOrder={sortOrder}
          onSortChange={handleSortOrderChange}
          currentChapterSlug={readingProgress?.chapterSlug}
        />

        {/* Comments Section */}
        <LazyCommentWrapper>
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
        </LazyCommentWrapper>
      </div>
    </div>
  );
}
