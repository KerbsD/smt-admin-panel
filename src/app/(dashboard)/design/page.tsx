import type { Metadata } from "next";

import Design from "@/modules/Design/Design";

export const instant = false;

export const metadata: Metadata = {
  title: "Designs",
};

export default function DesignPage() {
  return <Design />;
}
