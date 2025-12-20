"use client";

/**
 * Google OAuth Provider Wrapper
 * Client component wrapper for GoogleOAuthProvider
 * Provides context to check OAuth availability before rendering OAuth components
 */

import { createContext, useContext } from "react";
import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";

// Context to track if Google OAuth is available (client ID configured)
const GoogleOAuthAvailabilityContext = createContext<boolean>(false);

/**
 * Hook to check if Google OAuth is available
 * Use this before rendering any Google OAuth components to prevent
 * "must be used within GoogleOAuthProvider" errors
 */
export function useGoogleOAuthAvailable(): boolean {
  return useContext(GoogleOAuthAvailabilityContext);
}

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // If no client ID is provided, render children without OAuth provider
  // but still provide availability context as false
  if (!clientId) {
    return (
      <GoogleOAuthAvailabilityContext.Provider value={false}>
        {children}
      </GoogleOAuthAvailabilityContext.Provider>
    );
  }

  return (
    <GoogleOAuthAvailabilityContext.Provider value={true}>
      <GoogleProvider clientId={clientId}>{children}</GoogleProvider>
    </GoogleOAuthAvailabilityContext.Provider>
  );
}
