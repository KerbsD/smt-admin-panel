"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

import {
  AuthHeading,
  authButton,
  authForm,
  authInput,
  authLink,
} from "@/components/auth/auth-ui";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

import { Spinner } from "@/components/ui/spinner";

import useHandleResetPassword from "./useResetPassword";

export function ResetPassword() {
  const { onSubmit, errors, reset, token, isHydrated, register } =
    useHandleResetPassword();

  if (!isHydrated) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6 text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <AuthHeading title="Choose a new password">
        This also signs you out everywhere else for safety.
      </AuthHeading>

      {reset.isSuccess ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-700/30 bg-emerald-600/10 px-6 py-8 text-center">
            <CheckCircle2 className="size-8 text-emerald-700" />
            <p className="text-sm font-semibold text-emerald-900">
              Password updated
            </p>
            <p className="max-w-sm text-xs text-emerald-900/80">
              {reset.data?.message ?? "Log in with your new password."}
            </p>
          </div>
          <Link
            href="/login"
            className={buttonVariants({ className: authButton })}
          >
            Log in
          </Link>
        </div>
      ) : token === "" ? (
        <div className="space-y-5">
          <Alert variant="warning" title="Reset link is incomplete">
            Open the full link from your email. If it has expired, request a new
            one.
          </Alert>
          <Link
            href="/forgot-password"
            className={buttonVariants({ className: authButton })}
          >
            Request a new link
          </Link>
        </div>
      ) : (
        <>
          {errors.root?.message ? (
            <Alert variant="error">{errors.root.message}</Alert>
          ) : null}

          <Alert variant="info">
            <span className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Passwords must be at least 12 characters and not appear in known
              breaches.
            </span>
          </Alert>

          <form
            onSubmit={onSubmit}
            noValidate
            className={`space-y-6 pt-1 ${authForm}`}
          >
            <Field
              label="New password"
              htmlFor="newPwd"
              error={errors.newPwd?.message}
              required
            >
              <PasswordInput
                id="newPwd"
                autoComplete="new-password"
                placeholder="••••••••••••"
                autoFocus
                aria-invalid={Boolean(errors.newPwd)}
                className={authInput}
                {...register("newPwd")}
              />
            </Field>

            <Field
              label="Confirm new password"
              htmlFor="confirmPwd"
              error={errors.confirmPwd?.message}
              required
            >
              <PasswordInput
                id="confirmPwd"
                autoComplete="new-password"
                placeholder="••••••••••••"
                aria-invalid={Boolean(errors.confirmPwd)}
                className={authInput}
                {...register("confirmPwd")}
              />
            </Field>

            <Button
              type="submit"
              className={authButton}
              isLoading={reset.isPending}
            >
              Update password
            </Button>

            <p className="text-center text-[11px] text-neutral-600">
              <Link href="/login" className={authLink}>
                Back to log in
              </Link>
            </p>
          </form>
        </>
      )}
    </div>
  );
}
