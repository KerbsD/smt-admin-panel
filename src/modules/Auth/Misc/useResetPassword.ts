"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPassword as resetPasswordRequest } from "@/api/auth";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/useAuthStore";

import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/configs/schemas/auth";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import { useHashParam, useHydrated } from "@/lib/use-hash";

export function useResetPassword(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ResetPasswordValues) =>
      resetPasswordRequest(token, values.newPwd),
    onSuccess: () => {
      // The API revokes every refresh session when a password is reset.
      useAuthStore.getState().clear();
      queryClient.setQueryData(queryKeys.auth.session, null);
    },
  });
}

function useHandleResetPassword() {
  const token = useHashParam("token");
  const isHydrated = useHydrated();
  const reset = useResetPassword(token);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPwd: "", confirmPwd: "" },
  });

  const onSubmit = handleSubmit((values) => {
    reset.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 400) {
          if (error.fieldErrors.length > 0) {
            applyApiErrors<ResetPasswordValues>(error, setError, [
              "newPwd",
              "confirmPwd",
            ]);
            return;
          }
          setError("root", { message: error.message });
          return;
        }
        setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Could not reset your password.",
        });
      },
    });
  });

  return { onSubmit, errors, reset, token, isHydrated, register };
}

export default useHandleResetPassword;
