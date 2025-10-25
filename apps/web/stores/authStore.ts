/**
 * @fileoverview Authentication state management using Zustand
 */

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSignupMode: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setSignupMode: (mode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  clearError: () => void;
}

/**
 * @description Authentication store using Zustand for state management
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isSignupMode: true,

  /**
   * @description Sets access token and marks user as authenticated
   * @param token - JWT access token
   */
  setAccessToken: (token: string) => {
    set({
      accessToken: token,
      isAuthenticated: true,
    });
  },

  /**
   * @description Sets user data and marks user as authenticated
   * @param user - User object with id, email, and optional name
   */
  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  /**
   * @description Sets authentication mode (signup vs login)
   * @param mode - True for signup mode, false for login mode
   */
  setSignupMode: (mode: boolean) => {
    set({ isSignupMode: mode });
  },

  /**
   * @description Sets loading state for authentication operations
   * @param loading - Loading state boolean
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * @description Sets error message for authentication operations
   * @param error - Error message string or null to clear error
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * @description Clears all authentication data and resets state
   */
  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * @description Clears current error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
