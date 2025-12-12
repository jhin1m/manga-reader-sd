"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { chapterApi } from "@/lib/api/endpoints/chapter";
import { mangaApi } from "@/lib/api/endpoints/manga";
import { ReaderControls } from "./reader-controls";
import { ReaderImage } from "./reader-image";
import { ChapterWithNavigation } from "@/types/chapter";
import { Loader2 } from "lucide-react";
import { ChapterReaderComments } from "@/components/comments/chapter-reader-comments";

import { cn } from "@/lib/utils";

interface ReaderViewProps {
  mangaSlug: string;
  chapterSlug: string;
}

export function ReaderView({ mangaSlug, chapterSlug }: ReaderViewProps) {
  const router = useRouter();

  // State
  const [readingMode, setReadingMode] = useState<"single" | "long-strip">(
    "long-strip"
  );
  const [zoom, setZoom] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [imageSpacing, setImageSpacing] = useState(0);

  // Fetch Chapter Details
  const {
    data: chapter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapter", mangaSlug, chapterSlug],
    queryFn: async () => {
      const [chapterData, imagesData] = await Promise.all([
        chapterApi.getDetail(mangaSlug, chapterSlug),
        chapterApi.getImages(mangaSlug, chapterSlug),
      ]);

      return {
        ...chapterData,
        content: imagesData.images,
      } as ChapterWithNavigation;
    },
  });

  // Fetch Chapter List (for dropdown and navigation)
  const { data: chapterList } = useQuery({
    queryKey: ["manga-chapters", mangaSlug],
    queryFn: () => mangaApi.getChapters(mangaSlug),
    enabled: !!mangaSlug,
  });

  // Calculate navigation from chapter list
  const navigation = useMemo(() => {
    if (!chapterList?.data || !chapter) return undefined;

    // Sort chapters by chapter_number ascending
    const sortedChapters = [...chapterList.data].sort(
      (a, b) => a.chapter_number - b.chapter_number
    );

    // Find current chapter index
    const currentIndex = sortedChapters.findIndex(
      (ch) => ch.slug === chapterSlug
    );

    if (currentIndex === -1) return undefined;

    const previousChapter =
      currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex < sortedChapters.length - 1
        ? sortedChapters[currentIndex + 1]
        : null;

    return {
      previous: previousChapter
        ? {
            id: previousChapter.id,
            uuid: previousChapter.uuid,
            slug: previousChapter.slug,
            name: previousChapter.name,
            order: previousChapter.order,
          }
        : null,
      next: nextChapter
        ? {
            id: nextChapter.id,
            uuid: nextChapter.uuid,
            slug: nextChapter.slug,
            name: nextChapter.name,
            order: nextChapter.order,
          }
        : null,
    };
  }, [chapterList, chapter, chapterSlug]);

  // Track View
  useEffect(() => {
    if (chapterSlug && mangaSlug) {
      chapterApi.trackView(mangaSlug, chapterSlug).catch(console.error);
    }
  }, [mangaSlug, chapterSlug]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (readingMode === "single") {
          setCurrentPage((prev) =>
            Math.min(prev + 1, (chapter?.content?.length || 1) - 1)
          );
        }
      } else if (e.key === "ArrowLeft") {
        if (readingMode === "single") {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
        }
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readingMode, chapter]);

  // Navigation Handler
  const handleNavigateChapter = useCallback(
    (slug: string) => {
      router.push(`/manga/${mangaSlug}/${slug}`);
    },
    [router, mangaSlug]
  );

  // Touch Swipe for Single Mode
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (readingMode === "single") {
      if (isLeftSwipe) {
        // Next page
        setCurrentPage((prev) =>
          Math.min(prev + 1, (chapter?.content?.length || 1) - 1)
        );
      }
      if (isRightSwipe) {
        // Prev page
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load chapter</p>
        <button
          onClick={() => router.push(`/manga/${mangaSlug}`)}
          className="text-primary hover:underline"
        >
          Back to Manga
        </button>
      </div>
    );
  }

  const images = chapter.content || [];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor }}>
      <ReaderControls
        mangaSlug={mangaSlug}
        currentChapterSlug={chapterSlug}
        chapterList={chapterList?.data}
        navigation={navigation}
        readingMode={readingMode}
        onReadingModeChange={setReadingMode}
        zoom={zoom}
        onZoomChange={setZoom}
        backgroundColor={backgroundColor}
        onBackgroundColorChange={setBackgroundColor}
        imageSpacing={imageSpacing}
        onImageSpacingChange={setImageSpacing}
        showControls={showControls}
        onNavigateChapter={handleNavigateChapter}
      />

      {/* Click zone to toggle controls */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowControls(!showControls);
          }
        }}
        style={{ pointerEvents: showControls ? "none" : "auto" }}
      />

      {/* Main Content */}
      <main
        className={cn(
          "relative z-0 mx-auto min-h-screen transition-all duration-300",
          showControls ? "pt-16 pb-16" : "py-0"
        )}
        onClick={() => setShowControls(!showControls)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          maxWidth: "100%",
          backgroundColor,
        }}
      >
        <div
          className={cn(
            "mx-auto flex justify-center",
            readingMode === "long-strip"
              ? "flex-col items-center"
              : "items-center"
          )}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {readingMode === "single" ? (
            <ReaderImage
              src={images[currentPage]}
              alt={`Page ${currentPage + 1}`}
              index={currentPage}
              className="max-h-screen w-full object-contain"
            />
          ) : (
            images.map((src, index) => (
              <ReaderImage
                key={index}
                src={src}
                alt={`Page ${index + 1}`}
                index={index}
                className="w-full max-w-4xl"
                style={{ marginBottom: `${imageSpacing}px` }}
              />
            ))
          )}
        </div>
      </main>

      {/* Comments Section */}
      <div className="relative z-0 mx-auto w-full max-w-4xl bg-background px-4 py-8">
        <ChapterReaderComments
          mangaSlug={mangaSlug}
          chapterSlug={chapterSlug}
          className="w-full"
        />
      </div>

      {/* Single Mode Pagination Info */}
      {readingMode === "single" && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white backdrop-blur">
          {currentPage + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
