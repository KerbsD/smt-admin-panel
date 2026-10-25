"use client";

import { KeyRound } from "lucide-react";
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
import { Input } from "@/components/ui/input";

import { useHandleForgetPassword } from "./usePasswordFlows";

export function ForgotPassword() {
  const { onSubmit, sentMessage, register, errors, forgot } =
    useHandleForgetPassword();

  return (
    <div className="w-full space-y-5">
      <span className="flex size-11 items-center justify-center rounded-full bg-amber-600/15 text-amber-700">
        <KeyRound className="size-5" />
      </span>

      <AuthHeading title="Forgot password">
        We&apos;ll email you a secure link to choose a new password. The link
        expires in 15 minutes.
      </AuthHeading>

      {sentMessage ? (
        <>
          <Alert variant="success" title="Check your inbox">
            {sentMessage}
          </Alert>
          <p className="text-xs text-neutral-600">
            Didn&apos;t get it? Check spam, or wait a couple of minutes before
            requesting another link.
          </p>
          <Link
            href="/login"
            className={buttonVariants({ className: authButton })}
          >
            Back to log in
          </Link>
        </>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          className={`space-y-6 pt-1 ${authForm}`}
        >
          <Field
            label="Email"
            htmlFor="forgot-email"
            error={errors.email?.message}
            required
          >
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              autoFocus
              aria-invalid={Boolean(errors.email)}
              className={authInput}
              {...register("email")}
            />
          </Field>

          <Button
            type="submit"
            className={authButton}
            isLoading={forgot.isPending}
          >
            Send reset link
          </Button>

          <p className="text-center text-[11px] text-neutral-600">
            Remembered it?{" "}
            <Link href="/login" className={authLink}>
              Back to log in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
