"use client";

import { useMemo } from "react";

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  avatar_full_url: string;
  total_points: number;
  used_points: number;
  available_points: number;
  achievements_points: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Get initial auth state from localStorage
 */
function getInitialAuthState(): AuthState {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  try {
    const token = localStorage.getItem("auth-token");
    const userStr = localStorage.getItem("auth-user");

    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch {
    // Failed to parse user data
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };
}

/**
 * Hook to get current authentication state
 * For now, returns mock state. Will be replaced with actual auth store (Zustand) in Phase 2
 */
export function useAuth(): AuthState {
  const authState = useMemo(() => getInitialAuthState(), []);
  return authState;
}
