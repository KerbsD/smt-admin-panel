"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { login as loginRequest, type LoginInput } from "@/api/auth";
import { loginSchema, type LoginValues } from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import { safeNextPath } from "@/lib/redirect";
import { useAuthStore } from "@/store/useAuthStore";

function useLoginMutation(nextPath: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginInput) => loginRequest(values),
    onSuccess: ({ accessToken }) => {
      useAuthStore.getState().setAccessToken(accessToken);
      toast.success("Welcome back.");
      router.replace(nextPath);
    },
  });
}

function useLogin() {
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const login = useLoginMutation(nextPath);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { user: "", pwd: "" },
  });

  const onSubmit = handleSubmit((values) => {
    clearErrors("root");

    login.mutate(values, {
      onError: (error) => {
        if (!(error instanceof ApiError)) {
          setError("root", {
            message: "Something went wrong. Please try again.",
          });
          return;
        }

        if (error.status === 401) {
          setError("pwd", { message: "Invalid username or password." });
          return;
        }

        if (error.status === 400) {
          applyApiErrors<LoginValues>(error, setError, ["user", "pwd"]);
          return;
        }

        setError("root", { message: error.message });
      },
    });
  });

  return { register, onSubmit, errors, login };
}

export default useLogin;
