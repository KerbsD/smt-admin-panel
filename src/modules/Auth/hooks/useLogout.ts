"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logout as logoutRequest } from "@/api/auth";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    // Clear local state even if the network call fails; the user asked to leave.
    onSettled: () => {
      useAuthStore.getState().clear();
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      queryClient.setQueryData(queryKeys.auth.session, null);
      toast.success("Signed out.");
      router.replace("/login");
    },
  });
}
