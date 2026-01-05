"use client";

/**
 * Bookmark Button Component
 * Allows authenticated users to add/remove manga from their favorites
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { userFavoritesApi } from "@/lib/api/endpoints/user";
import { cn } from "@/lib/utils";
import type { Manga } from "@/types/manga";

interface BookmarkButtonProps {
  manga: Pick<Manga, "id" | "name">;
  initialBookmarked?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

export function BookmarkButton({
  manga,
  initialBookmarked = false,
  variant = "outline",
  size = "default",
  showText = true,
  className,
}: BookmarkButtonProps) {
  const t = useTranslations("manga");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tNotifications = useTranslations("notifications");

  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  // Add to favorites mutation
  const addMutation = useMutation({
    mutationFn: () => userFavoritesApi.add({ manga_id: manga.id }),
    onSuccess: () => {
      setIsBookmarked(true);
      toast.success(tNotifications("bookmarkAdded"), {
        description: manga.name,
      });
      // Invalidate both favorites list and status queries
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "favorites", manga.id, "status"],
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), {
        description: errorMessage,
      });
    },
  });

  // Remove from favorites mutation
  const removeMutation = useMutation({
    mutationFn: () => userFavoritesApi.remove(manga.id),
    onSuccess: () => {
      setIsBookmarked(false);
      toast.success(tNotifications("bookmarkRemoved"), {
        description: manga.name,
      });
      // Invalidate both favorites list and status queries
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "favorites", manga.id, "status"],
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), {
        description: errorMessage,
      });
    },
  });

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error(tErrors("unauthorized"), {
        description: t("addToBookmarks"),
      });
      return;
    }

    if (isBookmarked) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  const buttonText = isBookmarked
    ? showText
      ? t("bookmarked")
      : ""
    : showText
      ? tCommon("bookmark")
      : "";

  const Icon = isBookmarked ? BookmarkCheck : Bookmark;

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={isLoading}
      className={cn(
        "border-2 transition-all",
        isBookmarked
          ? "border-primary/30 hover:border-primary/50 bg-primary/10"
          : "border-muted-foreground/30 hover:border-primary/40",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {buttonText && <span className="ml-2">{buttonText}</span>}
    </Button>
  );
}
