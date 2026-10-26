import type { Metadata } from "next";
import { Poppins, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthProvider";
import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "SMT Admin",
    template: "%s · SMT Admin",
  },
  description: "Manage bookings, portfolio, merch, and design submissions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
