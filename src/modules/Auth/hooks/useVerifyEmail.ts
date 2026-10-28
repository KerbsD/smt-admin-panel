"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { verifyEmail as verifyEmailRequest } from "@/api/auth";
import { useHashParam, useHydrated } from "@/lib/use-hash";

function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => verifyEmailRequest(token),
  });
}

function useVerifyEmail() {
  const token = useHashParam("token");
  const isHydrated = useHydrated();
  const verify = useVerifyEmailMutation();
  const started = useRef(false);
  const { mutate } = verify;

  useEffect(() => {
    if (!isHydrated || token === "" || started.current) return;
    started.current = true;
    mutate(token);
  }, [isHydrated, token, mutate]);

  const isVerifying =
    !isHydrated || (token !== "" && (verify.isIdle || verify.isPending));

  return {
    isVerifying,
    verify,
    mutate,
    isHydrated,
    token,
  };
}

export default useVerifyEmail;
