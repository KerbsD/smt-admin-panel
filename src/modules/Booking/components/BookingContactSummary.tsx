import type { Booking } from "@/types/models";

interface BookingContactSummaryProps {
  booking: Booking;
}

export function BookingContactSummary({ booking }: BookingContactSummaryProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm sm:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Email
        </p>
        <p className="mt-0.5 break-all font-medium">{booking.email}</p>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Phone
        </p>
        <p className="mt-0.5 font-medium">{booking.phone || "—"}</p>
      </div>
      <div className="sm:col-span-2">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Message
        </p>
        <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">
          {booking.message || "No message included."}
        </p>
      </div>
    </div>
  );
}
