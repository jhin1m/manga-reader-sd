import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Create next-intl plugin with i18n configuration
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

// Export the config wrapped with next-intl plugin
export default withNextIntl(nextConfig);
