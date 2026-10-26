"use client";

import { ImageIcon, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { navigation } from "@/configs/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useLogout } from "@/modules/Auth/Misc/useLogout";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const LOGO_IMAGE: string | null = "/images/SMTLOGO.png";

const LOGO_SIZE = { width: 330, height: 150 };

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Sorry Mom Tattoo home"
      className="flex items-center justify-center"
    >
      {LOGO_IMAGE ? (
        <Image
          src={LOGO_IMAGE}
          alt="Sorry Mom Tattoo"
          width={LOGO_SIZE.width}
          height={LOGO_SIZE.height}
          priority
          className={cn("h-auto object-contain", compact ? "w-24" : "w-40")}
        />
      ) : (
        <span
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/25 text-neutral-400",
            compact ? "h-9 w-24" : "h-20 w-40",
          )}
        >
          <ImageIcon className={compact ? "size-3.5" : "size-5"} />
          <span className="text-[9px] uppercase tracking-[0.2em]">Logo</span>
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-4">
        <Brand />
      </div>

      <div className="mx-2 border-t border-white/10" />

      <nav className="flex flex-1 flex-col gap-2" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-4 rounded-md border px-4 py-3 transition-colors",
                isActive
                  ? "border-white/15 bg-white/4 text-white"
                  : "border-transparent text-neutral-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-white"
                    : "text-neutral-400 group-hover:text-neutral-200",
                )}
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-white/10 bg-white/3 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
            {initials(user?.username)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.username ?? "Signed in"}
            </p>
            <p className="text-[11px] text-neutral-500">Studio administrator</p>
          </div>
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-66 bg-neutral-950 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-70 border-r border-white/10 bg-neutral-950 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-66">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          {/* Logo sits on a dark chip so it stays legible on the light header */}
          <span className="rounded-md bg-neutral-950 px-2 py-1">
            <Brand compact />
          </span>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
