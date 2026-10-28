import type { Metadata } from "next";

import { Register } from "@/modules/Auth/Register";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return <Register />;
}
