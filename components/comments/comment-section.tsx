"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/authStore";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { CommentSkeleton } from "./comment-skeleton";
import { CommentEmpty } from "./comment-empty";
import type { Comment } from "@/types/comment";

interface CommentSectionProps {
  comments: Comment[];
  totalCount: number;
  isLoading: boolean;
  sort: "asc" | "desc";
  onSortChange: (sort: "asc" | "desc") => void;
  onAddComment: (content: string, parentId?: number | null) => Promise<void>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function CommentSection({
  comments,
  totalCount,
  isLoading,
  sort,
  onSortChange,
  onAddComment,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: CommentSectionProps) {
  const t = useTranslations("comment");
  const { isAuthenticated } = useAuthStore();

  if (isLoading) {
    return <CommentSkeleton count={3} />;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            {t("title")}
            <span className="text-sm font-normal text-muted-foreground">
              ({totalCount})
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortChange(sort === "desc" ? "asc" : "desc")}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sort === "desc" ? t("sortNewest") : t("sortOldest")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && (
          <CommentForm onSubmit={(content) => onAddComment(content)} />
        )}

        {comments.length === 0 ? (
          <CommentEmpty />
        ) : (
          <CommentList
            comments={comments}
            onReply={onAddComment}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </CardContent>
    </Card>
  );
}
