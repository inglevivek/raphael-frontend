import type { Metadata, Viewport } from "next";
import { RootProviders } from "@/components/layout/root-providers";
import localFont from "next/font/local"; // Or use google fonts loader
import "./globals.css";

// Assuming you downloaded these for local hosting (best for performance)
// Otherwise, keep one method only.
export const metadata: Metadata = {
  title: {
    default: "Raphael — AI Course Generator",
    template: "%s | Raphael"
  },
  description: "Learn anything with AI-generated structured courses.",
};

export const viewport: Viewport = {
  themeColor: "#111010",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased selection:bg-[var(--color-primary)] selection:text-white">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-body">
        <RootProviders>
          {/* Subtle noise overlay applied globally */}
          <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('/noise.svg')]" />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}