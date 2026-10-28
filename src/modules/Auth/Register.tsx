"use client";

import Link from "next/link";

import {
  AuthHeading,
  authButton,
  authForm,
  authInput,
  authLink,
} from "@/components/auth/auth-ui";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import { RegisterSuccess } from "./components/RegisterSuccess";
import useRegister from "./hooks/useRegister";

export function Register() {
  const {
    register,
    onSubmit,
    errors,
    pendingEmail,
    successMessage,
    registerMutation,
  } = useRegister();

  if (pendingEmail) {
    return <RegisterSuccess email={pendingEmail} message={successMessage} />;
  }

  return (
    <div className="w-full">
      <AuthHeading title="Create account">
        We&apos;ll email you a link to verify your address.
      </AuthHeading>

      {errors.root?.message ? (
        <Alert variant="error" className="mt-5">
          {errors.root.message}
        </Alert>
      ) : null}

      <form
        onSubmit={onSubmit}
        noValidate
        className={`mt-6 space-y-5 ${authForm}`}
      >
        <Field
          label="Username"
          htmlFor="user"
          error={errors.user?.message}
          hint="3–24 characters, letters and numbers only."
          required
        >
          <Input
            id="user"
            autoComplete="username"
            placeholder="your-username"
            aria-invalid={Boolean(errors.user)}
            className={authInput}
            {...register("user")}
          />
        </Field>

        <Field
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            aria-invalid={Boolean(errors.email)}
            className={authInput}
            {...register("email")}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="pwd"
          error={errors.pwd?.message}
          hint="At least 12 characters."
          required
        >
          <PasswordInput
            id="pwd"
            autoComplete="new-password"
            placeholder="••••••••••••"
            aria-invalid={Boolean(errors.pwd)}
            className={authInput}
            {...register("pwd")}
          />
        </Field>

        <Field
          label="Confirm password"
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
          isLoading={registerMutation.isPending}
        >
          Create account
        </Button>

        <p className="text-center text-[11px] text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className={authLink}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
