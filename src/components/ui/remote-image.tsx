"use client";

/* eslint-disable @next/next/no-img-element */

import { ImageOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface RemoteImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Plain <img> is intentional: admin-entered image URLs can point at arbitrary
 * hosts, which would require a wildcard next/image remotePatterns config.
 */
export function RemoteImage({ src, alt, className, imgClassName }: RemoteImageProps) {
  // Track which source failed instead of a boolean: when `src` changes the
  // comparison resets the error state without an effect or a remount.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = src != null && failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="size-6" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailedSrc(src)}
        className={cn("size-full object-cover", imgClassName)}
      />
    </div>
  );
}
