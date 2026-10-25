import type { Metadata } from "next";

import { ResetPassword } from "@/modules/Auth/Misc/ResetPassword";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
