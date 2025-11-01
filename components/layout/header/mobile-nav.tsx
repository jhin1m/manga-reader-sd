"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/lib/hooks/use-auth";
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

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/genres", label: "Genres", icon: Layers },
  { href: "/hot", label: "Hot", icon: Flame },
  { href: "/recent", label: "Recent", icon: Clock },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
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
                  {user.available_points} points
                </p>
              </div>
            </div>
          ) : (
            <Button asChild className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
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
                  <span>Library</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
