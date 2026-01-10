"use client";

import Script from "next/script";

/**
 * TypeScript declarations for Google Analytics
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics component for tracking pageviews and events
 *
 * This component loads the Google Analytics gtag.js script and initializes GA.
 * It should be included in the root layout to track all pages.
 *
 * Setup:
 * 1. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your .env.local
 * 2. Get your Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 3. Include this component in your root layout
 *
 * Privacy Compliance:
 * - Ensure GDPR/CCPA cookie consent before loading (if required in your region)
 * - Consider implementing cookie consent banner
 *
 * @example
 * ```tsx
 * <GoogleAnalytics />
 * ```
 *
 * @returns Google Analytics script tags or null if not configured
 */
export function GoogleAnalytics(): React.JSX.Element | null {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't load GA if measurement ID is not provided
  if (!measurementId) {
    return null;
  }

  // Validate measurement ID format (GA4: G-XXXXXXXXXX)
  const isValidFormat = /^G-[A-Z0-9]+$/.test(measurementId);
  if (!isValidFormat) {
    console.warn(
      `Invalid Google Analytics Measurement ID format: ${measurementId}. Expected format: G-XXXXXXXXXX`
    );
    return null;
  }

  return (
    <>
      {/* Load Google Analytics gtag.js script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Failed to load Google Analytics script:", e);
        }}
      />
      {/* Initialize Google Analytics */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Failed to initialize Google Analytics:", e);
        }}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
