"use client";

import { memo, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ReaderImageProps {
  src: string;
  alt: string;
  index: number;
  /** First few images should load eagerly (above-the-fold) */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

export const ReaderImage = memo(function ReaderImage({
  src,
  alt,
  index,
  priority = false,
  className,
  style,
  onLoad,
}: ReaderImageProps) {
  const t = useTranslations("reader");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Ref callback to handle images already loaded from cache before React hydration
  const setImgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0 && isLoading) {
        setIsLoading(false);
        onLoad?.();
      }
    },
    [isLoading, onLoad]
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full",
        isLoading ? "min-h-[50vh]" : "min-h-0",
        className
      )}
      style={style}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError ? (
        <div className="flex h-96 w-full flex-col items-center justify-center bg-muted p-4 text-center">
          <p className="text-muted-foreground">
            {t("failedToLoadImage", { number: index + 1 })}
          </p>
          <button onClick={handleRetry} className="mt-2 text-primary underline">
            {t("retry")}
          </button>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={setImgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          // Hint browser to fetch priority images sooner
          fetchPriority={priority ? "high" : "auto"}
          className={cn(
            "h-auto w-full block transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});
