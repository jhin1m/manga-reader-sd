import type { Metadata } from "next";

/**
 * SEO Config cho Động Hentai – Web đọc truyện hentai tiếng Việt lớn nhất
 */

export const siteConfig = {
  // Site identity
  name: "Động Hentai",
  shortName: "Động H",
  description:
    "Động Hentai - Web đọc truyện hentai, doujinshi tiếng Việt miễn phí nhanh nhất. Hàng ngàn bộ hentai full color, không che, uncensored, cập nhật liên tục 24/7.",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // thay bằng domain thật của bạn

  // Images
  ogImage: "/og-donghentai.jpg", // chuẩn bị 1 ảnh OG 1200x630 sexy nhưng không lộ hàng quá
  favicon: "/favicon.ico",

  // Keywords chính (tập trung từ khóa dài + từ khóa nóng của dân hentai VN)
  keywords: [
    "hentai",
    "đọc hentai",
    "truyện hentai",
    "hentai vn",
    "hentaivn",
    "động hentai",
    "doujinshi tiếng việt",
    "hentai không che",
    "hentai uncensored",
    "truyện sex hentai",
    "hentai full color",
    "hentai online",
    "netorare",
    "milf hentai",
    "loli hentai",
    "ahegao",
    "hentai mới nhất",
    "hentai hay",
  ],

  // Social (nếu có fanpage 18+ hoặc twitter 18+ thì điền vào)
  links: {
    twitter: "https://twitter.com/donghentaivn",
    telegram: "https://t.me/donghentai", // thường dân 18+ dùng Telegram nhiều hơn FB
  },

  // Author & publisher
  authors: [
    {
      name: "Team Động Hentai",
      url: "https://donghentai.xxx",
    },
  ],
  creator: "Team Động Hentai",
  publisher: "Động Hentai",
} as const;

/**
 * Default Metadata – áp dụng toàn site
 */
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | Động Hentai`, // ví dụ: "Netorare no Gakuen | Động Hentai"
  },

  description: siteConfig.description,
  keywords: Array.from(siteConfig.keywords),
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,

  applicationName: siteConfig.name,

  icons: {
    icon: siteConfig.favicon,
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name + " - Đọc Hentai Tiếng Việt Miễn Phí, Không Che",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Động Hentai - HentaiVN lớn nhất Việt Nam",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Động Hentai - HentaiVN #1 Việt Nam",
    description:
      "Đọc hentai tiếng Việt, doujinshi không che, full color, cập nhật hàng giờ!",
    images: [siteConfig.ogImage],
    creator: "@donghentaivn",
    site: "@donghentaivn",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "adult",
  classification: "adult",
  metadataBase: new URL(siteConfig.url),
};

/**
 * Page types (dùng cho schema JSON-LD nếu cần sau này)
 */
export const pageTypes = {
  home: "website",
  comic: "article",
  chapter: "article",
  tag: "collection",
  artist: "profile",
  search: "website",
} as const;

// Các hàm helper giữ nguyên
export function buildUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return buildUrl(imagePath);
}
