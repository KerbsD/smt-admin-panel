"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { verifyEmail as verifyEmailRequest } from "@/api/auth";

import { useHashParam, useHydrated } from "@/lib/use-hash";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmailRequest(token),
  });
}

function useHandleVerifyEmail() {
  const token = useHashParam("token");
  const isHydrated = useHydrated();
  const verify = useVerifyEmail();
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

export default useHandleVerifyEmail;
