"use client";

import { authButton, authForm, authInput } from "@/components/auth/auth-ui";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import useResendVerification from "../hooks/useResendVerification";

interface ResendVerificationFormProps {
  defaultEmail?: string;
  submitLabel?: string;
  onSent?: () => void;
}

export function ResendVerificationForm({
  defaultEmail = "",
  submitLabel = "Send verification link",
  onSent,
}: ResendVerificationFormProps) {
  const { onSubmit, sentMessage, register, errors, resend } =
    useResendVerification({
      defaultEmail,
      onSent,
    });

  if (sentMessage) {
    return (
      <Alert variant="success" title="Request received">
        {sentMessage}
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${authForm}`} noValidate>
      <Field
        label="Email"
        htmlFor="resend-email"
        error={errors.email?.message}
        required
      >
        <Input
          id="resend-email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          aria-invalid={Boolean(errors.email)}
          className={authInput}
          {...register("email")}
        />
      </Field>
      <Button type="submit" className={authButton} isLoading={resend.isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
