import type { Metadata } from "next";

import Dashboard from "@/modules/Dashboard/Dashboard";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <Dashboard />;
}
