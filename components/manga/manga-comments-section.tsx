"use client";

/**
 * Manga Comments Section Component
 * Container for displaying and managing comments on the latest chapter
 * and rating for the manga
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { CommentList } from "./comment-list";
import { AddCommentForm } from "./add-comment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chapterApi } from "@/lib/api/endpoints/chapter";
import type { Manga } from "@/types/manga";

interface MangaCommentsSectionProps {
  manga: Manga;
}

export function MangaCommentsSection({ manga }: MangaCommentsSectionProps) {
  const t = useTranslations("comments");
  const tChapter = useTranslations("chapter");
  const tErrors = useTranslations("errors");

  const [replyToId, setReplyToId] = useState<number | null>(null);

  // Get latest chapter slug for comments
  const latestChapterSlug =
    manga.latest_chapter?.slug || manga.first_chapter?.slug;

  const {
    data: commentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", latestChapterSlug],
    queryFn: () =>
      chapterApi.getComments(latestChapterSlug!, {
        per_page: 50,
        sort: "desc",
      }),
    enabled: !!latestChapterSlug,
  });

  const comments = commentsData?.data || [];

  const handleReply = (parentId: number) => {
    setReplyToId(parentId);
    // Scroll to the add comment form
    const formElement = document.getElementById("add-comment-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelReply = () => {
    setReplyToId(null);
  };

  const handleCommentSuccess = () => {
    setReplyToId(null);
  };

  if (!latestChapterSlug) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("noComments")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("comments")} -{" "}
            {manga.latest_chapter
              ? `${tChapter("chapter")} ${manga.latest_chapter.order}`
              : tChapter("chapter")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="comments">
                {t("comments")} ({comments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="space-y-6 mt-6">
              {/* Add Comment Form */}
              <div id="add-comment-form">
                <AddCommentForm
                  chapterSlug={latestChapterSlug}
                  parentId={replyToId}
                  onSuccess={handleCommentSuccess}
                  onCancel={replyToId ? handleCancelReply : undefined}
                />
              </div>

              {/* Comments List */}
              <CommentList
                comments={comments}
                chapterSlug={latestChapterSlug}
                onReply={handleReply}
                isLoading={isLoading}
              />

              {error && (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-sm text-destructive">
                      {tErrors("general")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
