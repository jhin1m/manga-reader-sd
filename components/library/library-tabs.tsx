"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLibraryPrefetch } from "@/lib/hooks/use-library";
import { ContinueReadingSection } from "./continue-reading-section";
import { BookmarksTab } from "./bookmarks-tab";
import { HistoryTab } from "./history-tab";
import { BookOpen, Bookmark, History } from "lucide-react";

interface LibraryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

// Valid tab values for type safety
const TAB_VALUES = ["continue", "bookmarks", "history"] as const;
type TabValue = (typeof TAB_VALUES)[number];

export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  const t = useTranslations("user.library.tabs");
  const { prefetchFavorites, prefetchHistory, prefetchContinueReading } =
    useLibraryPrefetch();

  // Validate tab value - default to "continue" if invalid
  const validTab: TabValue = TAB_VALUES.includes(activeTab as TabValue)
    ? (activeTab as TabValue)
    : "continue";

  // Prefetch inactive tabs on mount
  useEffect(() => {
    prefetchFavorites();
    prefetchHistory();
    prefetchContinueReading();
  }, [prefetchFavorites, prefetchHistory, prefetchContinueReading]);

  // Prefetch on hover handlers
  const handleBookmarksHover = () => prefetchFavorites();
  const handleHistoryHover = () => prefetchHistory();
  const handleContinueHover = () => prefetchContinueReading();

  return (
    <Tabs value={validTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger
          value="continue"
          className="h-10 gap-2"
          onMouseEnter={handleContinueHover}
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">{t("continue")}</span>
          <span className="sm:hidden">{t("continueShort")}</span>
        </TabsTrigger>

        <TabsTrigger
          value="bookmarks"
          className="h-10 gap-2"
          onMouseEnter={handleBookmarksHover}
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">{t("bookmarks")}</span>
          <span className="sm:hidden">{t("bookmarksShort")}</span>
        </TabsTrigger>

        <TabsTrigger
          value="history"
          className="h-10 gap-2"
          onMouseEnter={handleHistoryHover}
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">{t("history")}</span>
          <span className="sm:hidden">{t("historyShort")}</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="continue" className="mt-0">
          <ContinueReadingSection />
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-0">
          <BookmarksTab />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <HistoryTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
