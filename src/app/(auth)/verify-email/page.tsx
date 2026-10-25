import type { Metadata } from "next";

import { VerifyEmail } from "@/modules/Auth/Misc/VerifyEmail";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
