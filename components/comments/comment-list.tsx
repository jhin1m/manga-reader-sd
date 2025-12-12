"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CommentItem } from "./comment-item";
import type { Comment } from "@/types/comment";

interface CommentListProps {
  comments: Comment[];
  onReply: (content: string, parentId: number | null) => Promise<void>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function CommentList({
  comments,
  onReply,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: CommentListProps) {
  const t = useTranslations("comment");

  // Handle null/undefined comments
  if (!comments || comments.length === 0) {
    return (
      <div className="space-y-4 transition-opacity duration-200">
        <ul className="space-y-4" role="list" aria-label={t("listLabel")}>
          {/* No comments to render */}
        </ul>
        {hasMore && onLoadMore && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("loadMore")
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 transition-opacity duration-200">
      <ul className="space-y-4" role="list" aria-label={t("listLabel")}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            depth={0}
            onReply={onReply}
          />
        ))}
      </ul>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("loadMore")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
