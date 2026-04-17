import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Sinhala, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { AppMessagePortal } from "@/components/providers/app-message-portal";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MedicalDisclaimer } from "@/components/medical-disclaimer";
import { SITE_BRAND_LOCKUP_PLAIN, SITE_TAGLINE_EN } from "@/lib/site-brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSerifSinhala = Noto_Serif_Sinhala({
  variable: "--font-sinhala-display",
  subsets: ["sinhala"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: `${SITE_BRAND_LOCKUP_PLAIN} — ${SITE_TAGLINE_EN}`,
    template: `%s · ${SITE_BRAND_LOCKUP_PLAIN}`,
  },
  description:
    "Cancer literacy: global burden, science, treatments, myths vs facts, nutrition context, and a respectful community space.",
  openGraph: {
    title: `${SITE_BRAND_LOCKUP_PLAIN} — ${SITE_TAGLINE_EN}`,
    description:
      "Interactive learning, charts, and respectful community articles about cancer.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_BRAND_LOCKUP_PLAIN,
    description: SITE_TAGLINE_EN,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSinhala.variable} ${notoSerifSinhala.variable} min-h-screen min-w-0 antialiased`}
      >
        <ThemeProvider>
          <AuthSessionProvider>
            <div className="flex min-h-screen min-w-0 flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
              <SiteHeader />
              <main className="min-w-0 flex-1 pb-[max(0px,env(safe-area-inset-bottom))]">{children}</main>
              <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
                <MedicalDisclaimer />
              </div>
              <SiteFooter />
            </div>
            <AppMessagePortal />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
