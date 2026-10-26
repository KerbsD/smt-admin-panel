"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import { uploadImage, type UploadFolder } from "@/api/uploads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Keep in sync with smt-be/src/lib/uploads.ts.
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / (1024 * 1024);
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;
const ACCEPT_ATTRIBUTE = ACCEPTED_TYPES.join(",");

interface ImageUploadProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  folder: UploadFolder;
  disabled?: boolean;
  className?: string;
  /** Lets the parent disable its submit button while bytes are in flight. */
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Dropzone + URL fallback for admin image fields. Files go through the API
 * (`POST /admin/uploads`), which stores them in Supabase and returns a public
 * URL; the form only ever handles that URL.
 */
export function ImageUpload({
  id,
  value,
  onChange,
  folder,
  disabled,
  className,
  onUploadingChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const upload = useMutation({
    mutationFn: (file: File) => uploadImage(file, folder),
    onSuccess: ({ data }) => {
      onChange(data.url);
      toast.success("Image uploaded.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image.",
      );
    },
  });

  const isUploading = upload.isPending;
  const isDisabled = disabled || isUploading;

  const startUpload = (file: File | undefined) => {
    if (!file || isDisabled) return;

    if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
      toast.error("Choose a JPEG, PNG, WebP, AVIF, or GIF image.");
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Image must be ${MAX_UPLOAD_MB} MB or smaller.`);
      return;
    }

    onUploadingChange?.(true);
    upload.mutate(file, {
      onSettled: () => onUploadingChange?.(false),
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    startUpload(event.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isDisabled) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-3 py-3 transition-colors",
          isDragging && "border-primary bg-primary/5",
          isDisabled && "opacity-60",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium" aria-live="polite">
            {isUploading ? "Uploading…" : "Drop an image or choose a file"}
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, AVIF, or GIF · up to {MAX_UPLOAD_MB} MB
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isDisabled}
        >
          Browse
        </Button>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          disabled={isDisabled}
          onChange={(event) => {
            startUpload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      <Input
        id={id ? `${id}-url` : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or paste an image URL"
        disabled={isDisabled}
        aria-label="Image URL"
      />
    </div>
  );
}
