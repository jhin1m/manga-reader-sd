"use client";

/**
 * Comment List Component
 * Displays comments with nested replies, edit and delete functionality
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Trash2, Edit2, Reply } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { commentApi } from "@/lib/api/endpoints/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";

interface CommentListProps {
  comments: Comment[];
  chapterSlug: string;
  onReply: (parentId: number) => void;
  isLoading?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  chapterSlug: string;
  onReply: (parentId: number) => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  chapterSlug,
  onReply,
  isReply = false,
}: CommentItemProps) {
  const t = useTranslations("comments");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateMutation = useMutation({
    mutationFn: (content: string) =>
      commentApi.update(comment.id, { content }),
    onSuccess: () => {
      toast.success(t("commentPosted"));
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["comments", chapterSlug],
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), { description: errorMessage });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.delete(comment.id),
    onSuccess: () => {
      toast.success(t("commentDeleted"));
      queryClient.invalidateQueries({
        queryKey: ["comments", chapterSlug],
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), { description: errorMessage });
    },
  });

  const handleEdit = () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    updateMutation.mutate(editContent);
  };

  const handleDelete = () => {
    if (confirm(t("confirmDelete"))) {
      deleteMutation.mutate();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getUserInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={cn("space-y-3", isReply && "ml-8 pl-4 border-l-2")}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getUserInitials(comment.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-sm">{comment.user.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(comment.updated_at)}
                {comment.updated_at !== comment.created_at && " (đã chỉnh sửa)"}
              </div>
            </div>

            {/* Action Buttons */}
            {user && comment.can_edit && !isEditing && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-20"
                disabled={updateMutation.isPending}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={
                    updateMutation.isPending || editContent.trim() === ""
                  }
                >
                  {tCommon("save")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  disabled={updateMutation.isPending}
                >
                  {tCommon("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </div>
          )}

          {/* Reply Button */}
          {!isEditing && !isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              {t("reply")}
            </Button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              chapterSlug={chapterSlug}
              onReply={onReply}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({
  comments,
  chapterSlug,
  onReply,
  isLoading,
}: CommentListProps) {
  const t = useTranslations("comments");
  const tCommon = useTranslations("common");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-sm text-muted-foreground">
            {tCommon("loading")}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">{t("noComments")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("comments")} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              chapterSlug={chapterSlug}
              onReply={onReply}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
