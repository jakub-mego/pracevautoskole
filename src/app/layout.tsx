import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/email-verification-banner";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Práce v autoškole",
    template: "%s | Práce v autoškole",
  },
  description:
    "Tržiště práce pro autoškoly a profesionály oboru v ČR. Inzeráty, profily, matching.",
  verification: {
    google: "nBrY8bYKrvG1qNvexs4DWMsBw4cbOjT2DQwm--nfg90",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
        <SiteHeader />
        <EmailVerificationBanner />
        {children}
        <SiteFooter />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
