"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
}

export function CommentForm({ onSubmit, placeholder }: CommentFormProps) {
  const t = useTranslations("comment");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t("placeholder")}
        className="min-h-[80px] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t("submitHint")}</span>
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
              {t("submit")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
