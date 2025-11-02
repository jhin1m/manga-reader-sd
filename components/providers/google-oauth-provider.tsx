"use client";

/**
 * Google OAuth Provider Wrapper
 * Client component wrapper for GoogleOAuthProvider
 */

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // If no client ID is provided, render children without OAuth provider
  // This allows the app to work even if Google OAuth is not configured
  if (!clientId) {
    console.warn(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth will not be available."
    );
    return <>{children}</>;
  }

  return <GoogleProvider clientId={clientId}>{children}</GoogleProvider>;
}
