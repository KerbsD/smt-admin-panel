"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  forgotPassword as forgotPasswordRequest,
  resendVerification as resendVerificationRequest,
} from "@/api/auth";

import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";

interface ResendVerificationFormProps {
  defaultEmail?: string;
  onSent?: () => void;
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordRequest(email),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationRequest(email),
  });
}

export function useHandleForgetPassword() {
  const forgot = useForgotPassword();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    forgot.mutate(values.email, {
      onSuccess: (data) => {
        setSentMessage(data.message);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 400) {
          applyApiErrors<ForgotPasswordValues>(error, setError, ["email"]);
          return;
        }
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not send the reset email.",
        );
      },
    });
  });

  return { onSubmit, sentMessage, register, errors, forgot };
}

export function useHandleResendVerification({
  defaultEmail = "",
  onSent,
}: ResendVerificationFormProps) {
  const resend = useResendVerification();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = handleSubmit((values) => {
    resend.mutate(values.email, {
      onSuccess: (data) => {
        setSentMessage(data.message);
        onSent?.();
        toast.success("Verification email requested.");
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 400) {
          applyApiErrors<ForgotPasswordValues>(error, setError, ["email"]);
          return;
        }
        toast.error(
          error instanceof Error ? error.message : "Could not send the email.",
        );
      },
    });
  });

  return { onSubmit, sentMessage, register, errors, resend };
}
