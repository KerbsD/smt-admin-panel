"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";

import {
  AuthHeading,
  authButton,
  authButtonOutline,
} from "@/components/auth/auth-ui";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

interface RegisterSuccessProps {
  email: string;
  message: string;
}

export function RegisterSuccess({ email, message }: RegisterSuccessProps) {
  return (
    <div className="w-full space-y-5">
      <span className="flex size-11 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700">
        <MailCheck className="size-5" />
      </span>

      <AuthHeading title="Check your inbox">
        We sent a verification link to{" "}
        <span className="font-semibold text-neutral-900">{email}</span>. The link
        expires in 24 hours.
      </AuthHeading>

      <Alert variant="success">{message}</Alert>

      <p className="text-xs text-neutral-600">
        Click the link in the email to verify your address. If it expired, you
        can request a new one.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href={`/resend-verification?email=${encodeURIComponent(email)}`}
          className={`${buttonVariants({ variant: "outline" })} ${authButtonOutline}`}
        >
          Resend verification email
        </Link>
        <Link href="/login" className={`${buttonVariants()} ${authButton}`}>
          Go to log in
        </Link>
      </div>
    </div>
  );
}
