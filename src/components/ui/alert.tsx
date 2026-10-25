import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "error" | "info" | "success" | "warning";

const styles: Record<AlertVariant, { container: string; icon: typeof Info }> = {
  error: {
    container: "border-red-200 bg-red-50 text-red-800",
    icon: AlertCircle,
  },
  info: {
    container: "border-sky-200 bg-sky-50 text-sky-800",
    icon: Info,
  },
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: TriangleAlert,
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const style = styles[variant];
  const Icon = style.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        style.container,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-[13px] leading-relaxed opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
