"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CommentTabs } from "./comment-tabs";
import { CommentSection } from "./comment-section";
import { TabContent } from "./tab-content";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { chapterApi } from "@/lib/api/endpoints/chapter";

interface ChapterReaderCommentsProps {
  mangaSlug: string;
  chapterSlug: string;
  className?: string;
}

export function ChapterReaderComments({
  mangaSlug,
  chapterSlug,
  className,
}: ChapterReaderCommentsProps) {
  const tTabs = useTranslations("tabs");
  const tComment = useTranslations("comment");
  const queryClient = useQueryClient();

  // State for active tab
  const [activeTab, setActiveTab] = useState("chapter");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch chapter comments
  const { data: chapterCommentsData, isLoading: isLoadingChapterComments } =
    useQuery({
      queryKey: ["chapter-comments", mangaSlug, chapterSlug, sortOrder],
      queryFn: async () => {
        const response = await chapterApi.getComments(mangaSlug, chapterSlug, {
          sort: sortOrder,
          per_page: 20,
        });
        console.log("Chapter comments response:", response); // Debug log
        return {
          comments: response.data || [],
          totalCount: response.meta?.pagination?.total || 0,
          hasMore:
            (response.meta?.pagination?.current_page || 1) <
            (response.meta?.pagination?.last_page || 1),
        };
      },
    });

  // Fetch manga comments
  const { data: mangaCommentsData, isLoading: isLoadingMangaComments } =
    useQuery({
      queryKey: ["manga-comments", mangaSlug, sortOrder],
      queryFn: async () => {
        const response = await mangaApi.getComments(mangaSlug, {
          type: "manga",
          sort: sortOrder,
          per_page: 20,
        });
        console.log("Manga comments response:", response); // Debug log
        return {
          comments: response.data || [],
          totalCount: response.meta?.pagination?.total || 0,
          hasMore:
            (response.meta?.pagination?.current_page || 1) <
            (response.meta?.pagination?.last_page || 1),
        };
      },
    });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({
      content,
      parentId,
      type,
    }: {
      content: string;
      parentId?: number | null;
      type: "chapter" | "manga";
    }) => {
      if (type === "chapter") {
        return chapterApi.addComment(mangaSlug, chapterSlug, {
          content,
          parent_id: parentId,
        });
      } else {
        return mangaApi.addComment(mangaSlug, {
          content,
          parent_id: parentId,
        });
      }
    },
    onSuccess: (_, { type }) => {
      // Invalidate relevant query to refetch comments
      if (type === "chapter") {
        queryClient.invalidateQueries({
          queryKey: ["chapter-comments", mangaSlug, chapterSlug],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["manga-comments", mangaSlug],
        });
      }
    },
  });

  // Handle tab change
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: "asc" | "desc") => {
    setSortOrder(sort);
  }, []);

  // Handle adding comments
  const handleAddComment = useCallback(
    async (content: string, parentId?: number | null) => {
      const type = activeTab === "chapter" ? "chapter" : "manga";
      await addCommentMutation.mutateAsync({ content, parentId, type });
    },
    [activeTab, addCommentMutation]
  );

  // Handle load more (simplified for now, can be enhanced later)
  const handleLoadMoreChapterComments = useCallback(() => {
    // TODO: Implement pagination loading
    console.log("Load more chapter comments");
  }, []);

  const handleLoadMoreMangaComments = useCallback(() => {
    // TODO: Implement pagination loading
    console.log("Load more manga comments");
  }, []);

  // Prepare tabs data
  const tabs = [
    {
      id: "chapter",
      label: tTabs("chapterComments"),
      count: chapterCommentsData?.totalCount || 0,
      type: "chapter" as const,
      content: (
        <TabContent
          isLoading={isLoadingChapterComments}
          tabId="chapter-comments"
        >
          <CommentSection
            comments={chapterCommentsData?.comments || []}
            totalCount={chapterCommentsData?.totalCount || 0}
            isLoading={isLoadingChapterComments}
            sort={sortOrder}
            onSortChange={handleSortChange}
            onAddComment={handleAddComment}
            hasMore={chapterCommentsData?.hasMore || false}
          />
        </TabContent>
      ),
    },
    {
      id: "manga",
      label: tTabs("mangaComments"),
      count: mangaCommentsData?.totalCount || 0,
      type: "manga" as const,
      content: (
        <TabContent isLoading={isLoadingMangaComments} tabId="manga-comments">
          <CommentSection
            comments={mangaCommentsData?.comments || []}
            totalCount={mangaCommentsData?.totalCount || 0}
            isLoading={isLoadingMangaComments}
            sort={sortOrder}
            onSortChange={handleSortChange}
            onAddComment={handleAddComment}
            hasMore={mangaCommentsData?.hasMore || false}
          />
          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-yellow-100 text-xs">
              Debug: Manga Comments - Count:{" "}
              {mangaCommentsData?.comments?.length || 0}, Total:{" "}
              {mangaCommentsData?.totalCount || 0}
            </div>
          )}
        </TabContent>
      ),
    },
  ];

  // Combine all comments for "All Comments" tab
  const allComments = [
    ...(chapterCommentsData?.comments || []),
    ...(mangaCommentsData?.comments || []),
  ].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Add "All Comments" tab if there are any comments
  if (
    (chapterCommentsData?.totalCount || 0) > 0 ||
    (mangaCommentsData?.totalCount || 0) > 0
  ) {
    tabs.push({
      id: "all",
      label: tTabs("allComments"),
      count:
        (chapterCommentsData?.totalCount || 0) +
        (mangaCommentsData?.totalCount || 0),
      type: "chapter", // Default type for badge
      content: (
        <TabContent
          isLoading={isLoadingChapterComments || isLoadingMangaComments}
          tabId="all-comments"
        >
          <div className="space-y-6">
            <CommentSection
              comments={allComments}
              totalCount={allComments.length}
              isLoading={false}
              sort={sortOrder}
              onSortChange={handleSortChange}
              onAddComment={handleAddComment}
            />
          </div>
        </TabContent>
      ),
    });
  }

  return (
    <div className={className}>
      <CommentTabs
        tabs={tabs}
        defaultTab="chapter"
        onTabChange={handleTabChange}
        variant="segmented"
        className="w-full"
      />
    </div>
  );
}
