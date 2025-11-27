"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth, useLogout } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import {
  Menu,
  Home,
  Flame,
  Clock,
  Library,
  User,
  Settings,
  LogOut,
  LogIn,
  Layers,
} from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { logout } = useLogout();
  const router = useRouter();
  const t = useTranslations();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success(t("auth.logoutSuccess"));
      setOpen(false);
      router.push("/");
    }
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const navLinks = [
    { href: "/", label: t("navigation.home"), icon: Home },
    { href: "/genres", label: t("navigation.genres"), icon: Layers },
    { href: "/hot", label: t("navigation.hot"), icon: Flame },
    { href: "/recent", label: t("navigation.recent"), icon: Clock },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("navigation.mangaList")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t("navigation.mangaList")}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col space-y-4">
          {/* User Info Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 rounded-lg border p-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_full_url} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {t("user.availablePoints", { points: user.available_points })}
                </p>
              </div>
            </div>
          ) : (
            <Button asChild className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                {t("common.login")}
              </Link>
            </Button>
          )}

          <Separator />

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions (if authenticated) */}
          {isAuthenticated && (
            <>
              <Separator />
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/library"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Library className="h-4 w-4" />
                  <span>{t("navigation.library")}</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                  <span>{t("navigation.profile")}</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t("navigation.settings")}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("common.logout")}</span>
                </button>
              </nav>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
