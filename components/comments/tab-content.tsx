"use client";

import { ReactNode, useRef, useEffect } from "react";
import { CommentSkeleton } from "./comment-skeleton";
import { cn } from "@/lib/utils";

interface TabContentProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  preserveScroll?: boolean;
  tabId: string;
}

export function TabContent({
  children,
  isLoading,
  className,
  preserveScroll = true,
  tabId,
}: TabContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Save scroll position when tab becomes inactive
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !preserveScroll) return;

    return () => {
      scrollPositions.current.set(tabId, element.scrollTop);
    };
  }, [tabId, preserveScroll]);

  // Restore scroll position when tab becomes active
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !preserveScroll) return;

    const savedPosition = scrollPositions.current.get(tabId);
    if (savedPosition !== undefined) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        element.scrollTop = savedPosition;
      });
    }
  }, [tabId, preserveScroll]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-y-auto",
        // Smooth scrolling for better UX
        "scroll-smooth",
        // Prevent layout shift during loading
        "min-h-[200px]",
        className
      )}
      style={{
        // Max height to prevent overly long tabs
        maxHeight: "calc(100vh - 300px)",
      }}
    >
      {isLoading ? (
        <div className="space-y-4 p-4">
          <CommentSkeleton count={3} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
