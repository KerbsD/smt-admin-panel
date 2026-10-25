import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

const BACKGROUND_IMAGE: string | null = "/images/backdrop.JPG";
const LOGO_IMAGE: string | null = "/images/SMTLOGO.png";

const LOGO_SIZE = { width: 360, height: 240 };

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900 p-4 sm:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 size-112 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 size-120 rounded-full bg-white/4 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl shadow-black/60 md:min-h-112 md:grid-cols-2">
        <aside className="relative flex min-h-44 items-center justify-center overflow-hidden bg-neutral-950 md:min-h-0">
          {BACKGROUND_IMAGE ? (
            <Image
              src={BACKGROUND_IMAGE}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 448px, 100vw"
              className="object-cover grayscale"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 text-neutral-600">
              <ImageIcon className="size-8" />
              <span className="text-[10px] uppercase tracking-[0.2em]">
                Background image
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />

          <div className="relative z-10 px-8">
            {LOGO_IMAGE ? (
              <Image
                src={LOGO_IMAGE}
                alt="Sorry Mom Tattoo"
                width={LOGO_SIZE.width}
                height={LOGO_SIZE.height}
                priority
                className="h-auto w-48 object-contain md:w-72"
              />
            ) : (
              <div className="flex h-24 w-48 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/25 bg-black/30 text-neutral-400 backdrop-blur-sm md:h-36 md:w-72">
                <ImageIcon className="size-6" />
                <span className="text-[10px] uppercase tracking-[0.2em]">
                  Logo
                </span>
              </div>
            )}
          </div>
        </aside>

        <main className="flex items-center bg-[#d9d9d9] px-8 py-10 text-neutral-900 sm:px-12">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
