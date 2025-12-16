"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";
import { sanitizeText } from "@/lib/utils/sanitize";
import { CommentReplyForm } from "./comment-reply-form";
import { CommentBadge } from "./comment-badge";
import type { Comment } from "@/types/comment";

const MAX_DEPTH = 1; // API only supports comment (depth 0) and reply (depth 1)

interface CommentItemProps {
  comment: Comment;
  depth: number;
  onReply: (content: string, parentId: string | null) => Promise<void>;
}

export function CommentItem({ comment, depth, onReply }: CommentItemProps) {
  const t = useTranslations("comment");
  const { isAuthenticated } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 2);

  // Runtime validation to prevent infinite recursion
  const hasReplies =
    Array.isArray(comment.replies) && comment.replies.length > 0;
  const canNest = depth < MAX_DEPTH && depth >= 0; // Ensure depth is non-negative

  const handleReply = async (content: string) => {
    // Always pass comment.id for replies, never null or undefined
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  // Validate and format date safely (memoized for performance)
  const timeAgo = useMemo(() => {
    if (!comment.created_at) return t("unknownTime");

    const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
    const diff = Date.now() - new Date(comment.created_at).getTime();
    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(months / 12);

    if (years > 0) return rtf.format(-years, "year");
    if (months > 0) return rtf.format(-months, "month");
    if (days > 0) return rtf.format(-days, "day");
    if (hours > 0) return rtf.format(-hours, "hour");
    if (minutes > 0) return rtf.format(-minutes, "minute");
    return rtf.format(-seconds, "second");
  }, [comment.created_at, t]);

  return (
    <li
      className={cn(
        "group",
        depth > 0 && "ml-6 sm:ml-10 border-l-2 border-border pl-4"
      )}
      aria-level={depth + 1}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={comment.user.avatar_full_url}
            alt={comment.user.name}
          />
          <AvatarFallback>
            {comment.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.user.name}</span>
            <CommentBadge type={comment.commentable_type as "manga" | "chapter"} variant="compact" />
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          <p className="text-sm mt-1 whitespace-pre-wrap break-words">
            {sanitizeText(comment.content)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            {isAuthenticated && canNest && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="h-3 w-3 mr-1" />
                {t("reply")}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3">
              <CommentReplyForm
                onSubmit={handleReply}
                onCancel={() => setIsReplying(false)}
                replyingTo={comment.user.name}
              />
            </div>
          )}

          {/* Nested Replies */}
          {hasReplies && (
            <div className="mt-3">
              {comment.replies_count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs mb-2"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      {t("hideReplies")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      {t("showReplies", { count: comment.replies_count })}
                    </>
                  )}
                </Button>
              )}

              {showReplies && (
                <ul className="space-y-3">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
