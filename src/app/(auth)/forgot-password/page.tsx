import type { Metadata } from "next";

import { ForgotPassword } from "@/modules/Auth/Misc/ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
