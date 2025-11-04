"use client";

/**
 * SearchBar Component
 * Search input with debounced navigation to search results page
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

/**
 * SearchBar component with debounced search
 *
 * @param className - Optional additional CSS classes
 * @param placeholder - Optional custom placeholder text (overrides i18n default)
 */
export function SearchBar({ className, placeholder }: SearchBarProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Debounce search
  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(() => {
      // Navigate to search page with query
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || t("searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </form>
  );
}
