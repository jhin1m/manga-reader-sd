"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, X, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmojiPickerComponent } from "@/components/ui/emoji-picker";
import { useEmojiInsertion } from "@/hooks/use-emoji-insertion";

interface CommentReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  replyingTo: string;
}

export function CommentReplyForm({
  onSubmit,
  onCancel,
  replyingTo,
}: CommentReplyFormProps) {
  const t = useTranslations("comment");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handleEmojiSelect } = useEmojiInsertion(content, setContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleEmojiSelectWithClose = (emoji: string) => {
    handleEmojiSelect(emoji, textareaRef.current);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("replyingTo", { name: replyingTo })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("replyPlaceholder")}
          className="min-h-[60px] resize-none text-sm"
          disabled={isSubmitting}
          autoFocus
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <EmojiPickerComponent
                  onEmojiSelect={handleEmojiSelectWithClose}
                />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground">
              {t("submitHint")}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  {t("reply")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
