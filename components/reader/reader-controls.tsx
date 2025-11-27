"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import { ChapterNavigation } from "@/types/chapter";
import { cn } from "@/lib/utils";
import { ReaderSettingsPanel } from "./reader-settings-panel";

interface ReaderControlsProps {
  mangaSlug: string;
  currentChapterSlug: string;
  chapterList?: { slug: string; name: string; chapter_number: number }[];
  navigation?: ChapterNavigation;
  readingMode: "single" | "long-strip";
  onReadingModeChange: (mode: "single" | "long-strip") => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  imageSpacing: number;
  onImageSpacingChange: (spacing: number) => void;
  showControls: boolean;
  onNavigateChapter: (slug: string) => void;
}

export function ReaderControls({
  mangaSlug,
  currentChapterSlug,
  chapterList,
  navigation,
  readingMode,
  onReadingModeChange,
  zoom,
  onZoomChange,
  backgroundColor,
  onBackgroundColorChange,
  imageSpacing,
  onImageSpacingChange,
  showControls,
  onNavigateChapter,
}: ReaderControlsProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur transition-transform duration-300",
          showControls ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex items-center gap-4">
          <Link href={`/manga/${mangaSlug}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-medium line-clamp-1">
              {navigation?.next?.name || "Chapter Reader"}
            </h1>
            <Link
              href={`/manga/${mangaSlug}`}
              className="text-xs text-muted-foreground hover:underline"
            >
              Back to Manga
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-center border-t bg-background/95 px-4 backdrop-blur transition-transform duration-300",
          showControls ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={!navigation?.previous}
            onClick={() =>
              navigation?.previous &&
              onNavigateChapter(navigation.previous.slug)
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Chapter Selector - Centered */}
          <Select value={currentChapterSlug} onValueChange={onNavigateChapter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapterList?.map((chapter) => (
                <SelectItem key={chapter.slug} value={chapter.slug}>
                  Chapter {chapter.chapter_number}
                </SelectItem>
              )) || (
                <SelectItem value={currentChapterSlug}>
                  Current Chapter
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            disabled={!navigation?.next}
            onClick={() =>
              navigation?.next && onNavigateChapter(navigation.next.slug)
            }
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <ReaderSettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        readingMode={readingMode}
        onReadingModeChange={onReadingModeChange}
        zoom={zoom}
        onZoomChange={onZoomChange}
        backgroundColor={backgroundColor}
        onBackgroundColorChange={onBackgroundColorChange}
        imageSpacing={imageSpacing}
        onImageSpacingChange={onImageSpacingChange}
      />
    </>
  );
}
