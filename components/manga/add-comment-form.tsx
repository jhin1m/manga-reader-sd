"use client";

/**
 * Add Comment Form Component
 * Form for adding new comments or replying to existing ones
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { chapterApi } from "@/lib/api/endpoints/chapter";
import { useAuthStore } from "@/lib/store/authStore";

interface AddCommentFormProps {
  chapterSlug: string;
  parentId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddCommentForm({
  chapterSlug,
  parentId = null,
  onSuccess,
  onCancel,
}: AddCommentFormProps) {
  const t = useTranslations("comments");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const addCommentMutation = useMutation({
    mutationFn: (data: { content: string; parent_id?: number | null }) =>
      chapterApi.addComment(chapterSlug, data),
    onSuccess: () => {
      toast.success(t("commentPosted"));
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", chapterSlug],
      });
      onSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), { description: errorMessage });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error(t("loginToComment"));
      return;
    }

    if (content.trim() === "") {
      toast.error(tErrors("validation"));
      return;
    }

    addCommentMutation.mutate({ content: content.trim(), parent_id: parentId });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("loginToComment")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={
              parentId ? t("writeComment") + " (Trả lời)" : t("writeComment")
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-24 resize-none"
            disabled={addCommentMutation.isPending}
          />
          <div className="flex gap-2 justify-end">
            {parentId && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={addCommentMutation.isPending}
              >
                {tCommon("cancel")}
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                addCommentMutation.isPending || content.trim() === ""
              }
            >
              {addCommentMutation.isPending
                ? tCommon("loading")
                : t("addComment")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
