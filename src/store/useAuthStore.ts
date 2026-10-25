import { create } from "zustand";

interface AuthState {
  /**
   * Short-lived access token. Kept in memory only on purpose: persisting it to
   * localStorage would expose it to XSS. The httpOnly refresh cookie is what
   * survives reloads (see /auth/refresh).
   */
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null }),
}));
