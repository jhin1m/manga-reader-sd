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
  // Bundle analysis configuration
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === "true") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: isServer
            ? `../analyze/server.html`
            : `../analyze/client.html`,
        })
      );
    }
    return config;
  },
  // Optimization for large dependencies
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "embla-carousel-react",
    ],
  },
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

// Export the config wrapped with next-intl plugin
export default withNextIntl(nextConfig);
