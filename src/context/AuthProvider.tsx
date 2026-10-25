"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { refreshAccessToken } from "@/lib/api/fetcher";
import { getSessionUser } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthSession, SessionUser } from "@/types/models";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: SessionUser | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Boots the session once per page load. The refresh cookie is httpOnly, so the
 * only way to know whether a user is signed in is to ask the API to exchange it
 * for a short-lived access token.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const sessionQuery = useQuery<AuthSession | null>({
    queryKey: queryKeys.auth.session,
    queryFn: async () => {
      const token = await refreshAccessToken();
      if (!token) return null;
      return { accessToken: token, user: getSessionUser(token) };
    },
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated: accessToken !== null,
      // A token written by the login mutation makes the app usable immediately,
      // even if the initial refresh is still resolving.
      isInitializing: sessionQuery.isPending && accessToken === null,
      user: accessToken ? getSessionUser(accessToken) : null,
    };
  }, [accessToken, sessionQuery.isPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
