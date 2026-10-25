"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { FullPageLoader } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthProvider";

/**
 * Client-side guard. The access token lives in memory, so a Next.js middleware
 * can't see it; the refresh-cookie bootstrap in AuthProvider decides access.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing || isAuthenticated) return;

    const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${next}`);
  }, [isAuthenticated, isInitializing, pathname, router]);

  if (isInitializing) return <FullPageLoader />;
  if (!isAuthenticated) return <FullPageLoader label="Redirecting to sign in" />;

  return <>{children}</>;
}
