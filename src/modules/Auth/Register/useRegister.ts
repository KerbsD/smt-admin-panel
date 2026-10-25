"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { register as registerRequest, type RegisterInput } from "@/api/auth";

import { registerSchema, type RegisterValues } from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterInput) => registerRequest(values),
  });
}

function useHandleRegister() {
  const registerMutation = useRegister();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { user: "", email: "", pwd: "", confirmPwd: "" },
  });

  const onSubmit = handleSubmit((values) => {
    clearErrors("root");

    registerMutation.mutate(
      { user: values.user, email: values.email, pwd: values.pwd },
      {
        onSuccess: (data) => {
          setSuccessMessage(data.message);
          setPendingEmail(values.email);
          toast.success("Account created. Check your inbox.");
        },
        onError: (error) => {
          if (!(error instanceof ApiError)) {
            setError("root", {
              message: "Something went wrong. Please try again.",
            });
            return;
          }

          if (error.status === 409) {
            setError("user", { message: error.message });
            return;
          }

          if (error.status === 400) {
            applyApiErrors<RegisterValues>(error, setError, [
              "user",
              "email",
              "pwd",
            ]);
            return;
          }

          setError("root", { message: error.message });
        },
      },
    );
  });

  return {
    register,
    onSubmit,
    errors,
    pendingEmail,
    successMessage,
    registerMutation,
  };
}

export default useHandleRegister;
