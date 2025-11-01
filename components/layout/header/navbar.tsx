"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { BookOpen, Moon, Sun } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/genres", label: "Genres" },
  { href: "/hot", label: "Hot" },
  { href: "/recent", label: "Recent" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left: Mobile Nav + Logo */}
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Manga Reader
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (desktop only) */}
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <SearchBar className="w-full max-w-md" />
          </div>

          {/* Right: Nav Links + Theme Toggle + User Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" size="sm">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar (below header) */}
        <div className="pb-4 md:hidden">
          <SearchBar />
        </div>
      </Container>
    </header>
  );
}
