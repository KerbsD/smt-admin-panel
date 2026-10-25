import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/types/models";

const variants: Record<
  BookingStatus,
  "warning" | "info" | "success" | "muted"
> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "muted",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
