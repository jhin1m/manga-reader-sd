/**
 * Authentication Store
 * Zustand store for managing authentication state with localStorage persistence
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Authentication actions interface
 */
interface AuthActions {
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  getToken: () => string | null;
}

/**
 * Complete auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

/**
 * Auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Set authentication (after login/register)
       */
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      /**
       * Update user data (after profile update)
       */
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      /**
       * Logout and clear authentication
       */
      logout: () => set(initialState),

      /**
       * Get current token (helper method)
       */
      getToken: () => get().token,
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
