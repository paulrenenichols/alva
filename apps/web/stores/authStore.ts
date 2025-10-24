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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isSignupMode: true,

  setAccessToken: (token: string) => {
    set({
      accessToken: token,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  setSignupMode: (mode: boolean) => {
    set({ isSignupMode: mode });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
