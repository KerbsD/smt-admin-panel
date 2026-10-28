"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

import {
  AuthHeading,
  authButton,
  authButtonOutline,
} from "@/components/auth/auth-ui";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { ResendVerificationForm } from "./components/ResendVerificationForm";
import useVerifyEmail from "./hooks/useVerifyEmail";

export function VerifyEmail() {
  const { isVerifying, verify, mutate, isHydrated, token } = useVerifyEmail();

  return (
    <div className="w-full space-y-5">
      <AuthHeading title="Email verification">
        Confirming the address attached to your studio account.
      </AuthHeading>

      {isVerifying ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-400 bg-neutral-300/50 px-6 py-10 text-center">
          <Spinner className="size-6 text-neutral-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Verifying your email…</p>
            <p className="text-xs text-neutral-600">
              This only takes a moment.
            </p>
          </div>
        </div>
      ) : null}

      {verify.isSuccess ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-700/30 bg-emerald-600/10 px-6 py-8 text-center">
            <CheckCircle2 className="size-8 text-emerald-700" />
            <p className="text-sm font-semibold text-emerald-900">
              Email verified
            </p>
            <p className="max-w-sm text-xs text-emerald-900/80">
              {verify.data?.message ??
                "You can now log in to the admin console."}
            </p>
          </div>
          <Link
            href="/login"
            className={buttonVariants({ className: authButton })}
          >
            Continue to log in
          </Link>
        </div>
      ) : null}

      {verify.isError ? (
        <div className="space-y-5">
          <Alert variant="error" title="We couldn't verify this link">
            {verify.error instanceof Error
              ? verify.error.message
              : "The verification link is invalid or has expired."}
          </Alert>
          <div className="space-y-4 border-t border-neutral-400 pt-5">
            <div className="flex items-start gap-2 text-xs text-neutral-600">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Request a fresh link and use it within 24 hours.
            </div>
            <ResendVerificationForm submitLabel="Send a new link" />
          </div>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              className: authButtonOutline,
            })}
          >
            Back to log in
          </Link>
        </div>
      ) : null}

      {isHydrated && token === "" ? (
        <div className="space-y-5">
          <Alert variant="info" title="Missing verification token">
            Open the full link from your email, or request a new verification
            email below.
          </Alert>
          <ResendVerificationForm submitLabel="Send a new link" />
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              className: authButtonOutline,
            })}
          >
            Back to log in
          </Link>
        </div>
      ) : null}

      {isHydrated &&
      token !== "" &&
      !isVerifying &&
      !verify.isSuccess &&
      !verify.isError ? (
        <Button
          type="button"
          className={authButton}
          onClick={() => mutate(token)}
        >
          Try again
        </Button>
      ) : null}
    </div>
  );
}
