"use client";

/**
 * Manga Rating Component
 * Displays average rating and allows users to rate the manga with stars
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ratingApi } from "@/lib/api/endpoints/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { cn, formatNumber } from "@/lib/utils";

interface MangaRatingProps {
  slug: string;
  averageRating: number;
  totalRatings: number;
}

export function MangaRating({
  slug,
  averageRating = 0,
  totalRatings = 0,
}: MangaRatingProps) {
  const t = useTranslations("rating");
  const tErrors = useTranslations("errors");
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Ensure we have valid numbers
  const safeAverageRating = Number(averageRating) || 0;
  const safeTotalRatings = Number(totalRatings) || 0;

  const rateMutation = useMutation({
    mutationFn: (rating: number) => ratingApi.rateManga(slug, { rating }),
    onSuccess: (data) => {
      toast.success(t("ratingSubmitted"));
      setSelectedRating(data.rating.rating);
      // Invalidate and refetch manga data to update average rating
      queryClient.invalidateQueries({ queryKey: ["manga", slug] });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tErrors("general");
      toast.error(tErrors("general"), { description: errorMessage });
    },
  });

  const handleRatingClick = (rating: number) => {
    if (!isAuthenticated) {
      toast.error(tErrors("unauthorized"));
      return;
    }

    setSelectedRating(rating);
    rateMutation.mutate(rating);
  };

  const displayRating = hoveredRating || selectedRating || safeAverageRating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          {t("rateThisManga")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Average Rating Display */}
          <div className="text-center">
            <div className="text-4xl font-bold">{safeAverageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">
              {t("averageRating")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("totalRatings", { count: formatNumber(safeTotalRatings) })}
            </div>
          </div>

          {/* Star Rating Input */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm font-medium">
              {selectedRating
                ? t("yourRating")
                : isAuthenticated
                  ? t("rateThisManga")
                  : tErrors("unauthorized")}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "p-1 h-auto hover:bg-transparent",
                    !isAuthenticated && "cursor-not-allowed opacity-50"
                  )}
                  disabled={rateMutation.isPending || !isAuthenticated}
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-all",
                      rating <= displayRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-muted-foreground",
                      hoveredRating && rating <= hoveredRating && "scale-110"
                    )}
                  />
                </Button>
              ))}
            </div>
            {selectedRating && (
              <div className="text-sm text-muted-foreground">
                {t("yourRating")}: {selectedRating}/5
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
