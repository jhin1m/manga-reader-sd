import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GoogleOAuthProvider } from "@/components/providers/google-oauth-provider";
import { ReactQueryProvider } from "@/components/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/header/navbar";
import { Footer } from "@/components/layout/footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { defaultMetadata } from "@/lib/seo/config";
import { generateWebsiteSchema } from "@/lib/seo/json-ld";

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

/**
 * Root Layout Metadata
 *
 * Using centralized SEO configuration from lib/seo/config.ts
 * To update site-wide SEO, edit the siteConfig in that file.
 */
export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get messages for the current locale from next-intl
  const messages = await getMessages();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
      </head>
      <body className={`${notoSans.variable} antialiased`}>
        <NextIntlClientProvider
          messages={messages}
          locale="vi"
          timeZone="Asia/Ho_Chi_Minh"
          now={new Date()}
        >
          <ReactQueryProvider>
            <GoogleOAuthProvider>
              <ThemeProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ThemeProvider>
            </GoogleOAuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
