import type { Metadata } from "next";

import Merch from "@/modules/Merch/Merch";

export const instant = false;

export const metadata: Metadata = {
  title: "Merch",
};

export default function MerchPage() {
  return <Merch />;
}
