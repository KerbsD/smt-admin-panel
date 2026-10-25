import type { Metadata } from "next";

import Portfolio from "@/modules/Portfolio/Portfolio";

export const instant = false;

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return <Portfolio />;
}
