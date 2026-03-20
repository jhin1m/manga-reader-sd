"use client";

/**
 * Chapter list section for manga detail page
 * Extracted from manga-detail-content.tsx for modularity
 */

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChapterListItem } from "@/types/chapter";

interface MangaChapterListProps {
  mangaSlug: string;
  chapters: ChapterListItem[];
  isLoading?: boolean;
  sortOrder: "newest" | "oldest";
  onSortChange: (order: "newest" | "oldest") => void;
  /** Current reading chapter slug for highlighting */
  currentChapterSlug?: string;
}

export function MangaChapterList({
  mangaSlug,
  chapters,
  isLoading = false,
  sortOrder,
  onSortChange,
  currentChapterSlug,
}: MangaChapterListProps) {
  const t = useTranslations("manga");
  const tChapter = useTranslations("chapter");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChapters = useMemo(() => {
    if (!searchTerm) return chapters;
    const lower = searchTerm.toLowerCase();
    return chapters.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.chapter_number.toString().includes(lower)
    );
  }, [chapters, searchTerm]);

  const handleSortChange = useCallback(() => {
    onSortChange(sortOrder === "newest" ? "oldest" : "newest");
  }, [sortOrder, onSortChange]);

  return (
    <Card>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/chibi.svg"
                alt="Reading"
                width={30}
                height={30}
                className="inline-block"
              />
              {tChapter("chapterList")}
              <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {chapters.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative w-32 sm:w-48 transition-all focus-within:w-40 sm:focus-within:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={t("detail.searchChapterPlaceholder")}
                  className="pl-8 h-8 text-xs rounded-full bg-secondary/30 border-transparent focus:bg-background focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleSortChange}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Chapter Grid */}
          <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2.5 border-b border-border/40"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-3 w-12 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : filteredChapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 transition-opacity duration-200">
                {filteredChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${mangaSlug}/${chapter.slug}`}
                    className="flex justify-between py-2.5 border-b border-border/40 hover:bg-secondary/20 hover:pl-2 transition-all duration-200 rounded-sm"
                  >
                    <div className="min-w-0 pr-2 flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium text-foreground/90 group-hover:text-primary truncate">
                          {tChapter("chapter")} {chapter.chapter_number}
                        </div>
                        {chapter.name &&
                          chapter.name !==
                            `Chapter ${chapter.chapter_number}` && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {chapter.name}
                            </div>
                          )}
                      </div>
                      {currentChapterSlug === chapter.slug && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 h-4 bg-primary/10 text-primary flex-shrink-0"
                        >
                          {t("detail.reading")}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap font-mono flex-shrink-0">
                      {new Date(chapter.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                {t("detail.noChapters")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
