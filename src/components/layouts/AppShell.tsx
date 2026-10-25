"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { navigation } from "@/configs/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useLogout } from "@/modules/Auth/Misc/useLogout";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-amber-400 font-mono text-[11px] font-bold tracking-tight text-neutral-950">
        SMT
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-white">SMT Studio</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          Admin console
        </span>
      </span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-2">
        <Brand />
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
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
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-amber-400"
                    : "text-neutral-500 group-hover:text-neutral-300",
                )}
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="truncate text-[11px] text-neutral-500">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] bg-neutral-950 lg:block">
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
          <aside className="relative h-full w-[280px] border-r border-white/10 bg-neutral-950 shadow-2xl">
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

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-neutral-950 font-mono text-[9px] font-bold text-amber-400">
              SMT
            </span>
            <span className="text-sm font-semibold">Studio Admin</span>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
