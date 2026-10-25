import type { ReactNode } from "react";

/**
 * Shared look for every page rendered inside AuthShell.
 * Change a style here and all auth pages follow.
 */

/** Flat, underline-only input on the light gray panel. */
export const authInput =
  "h-9 rounded-none border-0 border-b border-neutral-500 bg-transparent px-0 text-sm text-neutral-900 shadow-none placeholder:text-neutral-500 focus-visible:border-neutral-900 focus-visible:ring-0";

/** Put on the <form> (or a wrapper): restyles every <label> inside it. */
export const authForm =
  "[&_label]:text-[10px] [&_label]:font-semibold [&_label]:uppercase [&_label]:tracking-wide [&_label]:text-neutral-700";

/** Solid dark primary button. Works on <Button> and on buttonVariants() links. */
export const authButton =
  "h-11 w-full rounded-md bg-neutral-800 text-sm font-bold uppercase tracking-wide text-white hover:bg-neutral-950";

/** Outlined secondary button for the gray panel. */
export const authButtonOutline =
  "h-11 w-full rounded-md border border-neutral-500 bg-transparent text-sm font-bold uppercase tracking-wide text-neutral-800 hover:bg-neutral-300";

/** Small underlined gray link. */
export const authLink = "underline underline-offset-2 hover:text-neutral-900";

export function AuthHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold uppercase tracking-tight">{title}</h2>
      {children ? (
        <p className="mt-1 text-xs text-neutral-600">{children}</p>
      ) : null}
    </div>
  );
}
