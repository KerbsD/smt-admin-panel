"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/context/AuthProvider";

const GUEST_ONLY_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "resend-verification",
  "/verify-email",
];

export function UnauthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);

  useEffect(() => {
    if (isGuestOnlyRoute && isAuthenticated) {
      router.replace("/");
    }
  }, [isGuestOnlyRoute, isAuthenticated, router]);

  return <>{children}</>;
}
