"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resendVerification as resendVerificationRequest } from "@/api/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";

interface UseResendVerificationOptions {
  defaultEmail?: string;
  onSent?: () => void;
}

function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationRequest(email),
  });
}

function useResendVerification({
  defaultEmail = "",
  onSent,
}: UseResendVerificationOptions = {}) {
  const resend = useResendVerificationMutation();
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

export default useResendVerification;
