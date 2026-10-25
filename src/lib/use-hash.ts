"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const readHash = (name: string): string => {
  if (typeof window === "undefined") return "";
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return "";
  return new URLSearchParams(hash).get(name) ?? "";
};

/**
 * Reads a value from the URL hash (the API puts verification and reset tokens
 * there so they never reach the server or a Referer header).
 *
 * useSyncExternalStore keeps the server render ("") and the hydrated client
 * render in sync without a setState-in-effect, and it re-renders once the
 * browser exposes the real hash.
 */
export function useHashParam(name: string): string {
  return useSyncExternalStore(
    subscribe,
    () => readHash(name),
    () => "",
  );
}

/** False during SSR and the hydration render, true once mounted on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
