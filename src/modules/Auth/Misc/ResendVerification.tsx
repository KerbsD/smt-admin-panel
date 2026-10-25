"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthHeading, authLink } from "@/components/auth/auth-ui";
import { ResendVerificationForm } from "@/modules/Auth/Misc/ResendVerificationForm";

export function ResendVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <div className="w-full space-y-5">
      <span className="flex size-11 items-center justify-center rounded-full bg-amber-600/15 text-amber-700">
        <MailCheck className="size-5" />
      </span>

      <AuthHeading title="Resend verification">
        Enter the email you registered with and we&apos;ll send a fresh
        verification link.
      </AuthHeading>

      <ResendVerificationForm defaultEmail={email} />

      <p className="text-center text-[11px] text-neutral-600">
        Already verified?{" "}
        <Link href="/login" className={authLink}>
          Log in
        </Link>
      </p>
    </div>
  );
}
