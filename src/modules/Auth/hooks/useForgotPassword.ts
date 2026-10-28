"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { forgotPassword as forgotPasswordRequest } from "@/api/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";

function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordRequest(email),
  });
}

function useForgotPassword() {
  const forgot = useForgotPasswordMutation();
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

export default useForgotPassword;
