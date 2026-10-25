import type { Metadata } from "next";

import Booking from "@/modules/Booking/Booking";

export const instant = false;

export const metadata: Metadata = {
  title: "Bookings",
};

export default function BookingsPage() {
  return <Booking />;
}
