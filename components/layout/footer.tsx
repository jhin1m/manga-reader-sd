import Link from "next/link";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Facebook, Twitter, MessageCircle } from "lucide-react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/genres", label: "Genres" },
  { href: "/hot", label: "Hot Manga" },
  { href: "/recent", label: "Recent Updates" },
  { href: "/search", label: "Search" },
];

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: Twitter,
  },
  {
    href: "https://discord.com",
    label: "Discord",
    icon: MessageCircle,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <Container className="py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Navigation Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Info Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal & Info</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Branding Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold">Manga Reader</span>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Your favorite place to read manga online.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} Manga Reader. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
