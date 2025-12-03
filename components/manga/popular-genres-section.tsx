"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GENRES = [
  {
    id: "98",
    key: "drama",
    image: "/drama-girl-2.png",
    bgImage: "/slide-0.png", // Background pattern for drama
    // Using primary color from theme
    bgClass: "bg-primary/60 hover:bg-primary/40",
    textClass: "text-primary-foreground dark:text-white/60",
    glowClass: "shadow-lg hover:shadow-xl",
  },
  {
    id: "1",
    key: "action",
    image: "/action-girl.png",
    bgImage: "/slide-action.png", // Background pattern for action
    // Using accent color from theme
    bgClass: "bg-chart-2/30 hover:bg-chart-2/20",
    textClass: "text-background dark:text-white/60",
    glowClass: "shadow-lg hover:shadow-xl",
  },
  {
    id: "2",
    key: "romance",
    image: "/romance-girl.png",
    bgImage: "/slide-2-2.png", // Background pattern for romance
    // Using chart-2 color from theme
    bgClass: "bg-chart-2/30 hover:bg-chart-2/20",
    textClass: "text-chart-1/80 dark:text-white/60",
    glowClass: "shadow-lg hover:shadow-xl",
  },
  {
    id: "3",
    key: "fantasy",
    image: "/fantasy-girl.png",
    bgImage: "/slide-3-3.png", // Background pattern for fantasy
    // Using chart-5 color from theme
    bgClass: "bg-chart-5/30 hover:bg-chart-5/20",
    textClass: "text-chart-1/80 dark:text-chart-5/60",
    glowClass: "shadow-lg hover:shadow-xl",
  },
];

export function PopularGenresSection() {
  const t = useTranslations("homepage.genres");

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-8">
        {GENRES.map((genre) => (
          <Link
            key={genre.id}
            href={`/browse?genre=${genre.id}`}
            className="group"
          >
            <Card
              className={cn(
                "relative h-32 overflow-visible transition-all duration-300 hover:-translate-y-1",
                genre.bgClass,
                genre.glowClass
              )}
              style={{
                backgroundImage: `url('${genre.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="absolute inset-0 flex items-center px-6">
                <div className="z-10">
                  <h3
                    className={cn(
                      "text-3xl font-black uppercase tracking-wider font-road-rage",
                      genre.textClass
                    )}
                  >
                    {t(genre.key)}
                  </h3>
                  <span className="text-xs font-medium text-foreground mt-1 block group-hover:text-foreground transition-colors">
                    {t("explore")} &rarr;
                  </span>
                </div>
              </div>

              {/* Image with pop-out effect */}
              <div className="absolute -bottom-4 -right-4 w-40 h-48 pointer-events-none">
                <Image
                  src={genre.image}
                  alt={t(genre.key)}
                  fill
                  className="object-contain object-bottom drop-shadow-xl transition-transform duration-300 group-hover:scale-110 z-10"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
