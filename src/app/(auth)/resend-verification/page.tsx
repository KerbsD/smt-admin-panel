import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCardSkeleton } from "@/components/layouts/AuthCardSkeleton";
import { ResendVerification } from "@/modules/Auth/Misc/ResendVerification";

export const metadata: Metadata = {
  title: "Resend verification",
};

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <ResendVerification />
    </Suspense>
  );
}
