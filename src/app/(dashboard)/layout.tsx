import type { ReactNode } from "react";

import { AppShell } from "@/components/layouts/AppShell";
import { AuthGuard } from "@/components/layouts/AuthGuard";

// The admin console is a client-rendered SPA behind a cookie-session guard, so
// there is no server-cached shell to validate for instant navigation. The guard
// and TanStack Query own the loading states.
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
