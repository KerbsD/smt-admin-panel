import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/types/models";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const variants: Record<
  BookingStatus,
  "warning" | "info" | "success" | "destructive"
> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "destructive",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
