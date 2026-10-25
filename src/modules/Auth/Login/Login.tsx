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

import useHandleLogin from "./useLogin";

export function Login() {
  const { register, onSubmit, errors, login } = useHandleLogin();

  return (
    <div className="w-full">
      <AuthHeading title="Log in">
        GTFO if you&apos;re not one of us.
      </AuthHeading>

      {errors.root?.message ? (
        <Alert variant="error" className="mt-5">
          {errors.root.message}
        </Alert>
      ) : null}

      <form
        onSubmit={onSubmit}
        noValidate
        className={`mt-8 space-y-6 ${authForm}`}
      >
        <Field
          label="Username"
          htmlFor="user"
          error={errors.user?.message}
          required
        >
          <Input
            id="user"
            autoComplete="username"
            placeholder="your-username"
            autoFocus
            aria-invalid={Boolean(errors.user)}
            className={authInput}
            {...register("user")}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="pwd"
          error={errors.pwd?.message}
          required
        >
          <PasswordInput
            id="pwd"
            autoComplete="current-password"
            placeholder="••••••••••••"
            aria-invalid={Boolean(errors.pwd)}
            className={authInput}
            {...register("pwd")}
          />
        </Field>

        <Button
          type="submit"
          isLoading={login.isPending}
          className={authButton}
        >
          Log in
        </Button>

        <div className="flex items-center justify-end text-[11px] text-neutral-600">
          <Link href="/forgot-password" className={authLink}>
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
