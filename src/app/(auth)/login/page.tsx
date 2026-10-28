import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCardSkeleton } from "@/components/layouts/AuthCardSkeleton";
import { Login } from "@/modules/Auth/Login";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <Login />
    </Suspense>
  );
}
