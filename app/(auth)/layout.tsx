import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/seo/config";

export const metadata: Metadata = defaultMetadata;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
