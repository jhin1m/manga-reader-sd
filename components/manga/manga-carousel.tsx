"use client";

/**
 * MangaCarousel Component
 * Reusable carousel component for displaying manga in a horizontal scrollable view
 * Features: Autoplay, responsive sizing (6 items default on large screens), navigation controls
 */

import Autoplay from "embla-carousel-autoplay";

import type { MangaListItem } from "@/types/manga";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MangaCard } from "./manga-card";
import { cn } from "@/lib/utils";

export interface MangaCarouselProps {
  mangas: MangaListItem[];
  title?: string;
  icon?: React.ReactNode;
  autoplayDelay?: number;
  className?: string;
  showNavigation?: boolean;
}

/**
 * MangaCarousel component for displaying manga in a carousel
 * Displays 6 items by default on large screens with responsive sizing
 *
 * @param mangas - Array of manga items to display
 * @param title - Optional section title
 * @param icon - Optional icon to display before title
 * @param autoplayDelay - Autoplay delay in milliseconds (default: 3000)
 * @param className - Optional additional CSS classes
 * @param showNavigation - Whether to show navigation buttons (default: true)
 */
export function MangaCarousel({
  mangas,
  title,
  icon,
  autoplayDelay = 3000,
  className,
  showNavigation = true,
}: MangaCarouselProps) {
  if (!mangas || mangas.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className={cn("w-full", className)}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {(title || showNavigation) && (
            <>
              {title ? (
                <div className="flex items-center gap-3">
                  {icon}
                  <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                </div>
              ) : (
                <div />
              )}

              {showNavigation && (
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              )}
            </>
          )}
        </CardHeader>

        <CardContent>
          <CarouselContent className="-ml-2 md:-ml-4">
            {mangas.map((manga) => (
              <CarouselItem
                key={manga.id}
                className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/8"
              >
                <MangaCard manga={manga} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </CardContent>
      </Card>
    </Carousel>
  );
}
