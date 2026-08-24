import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نظام إدارة الصالة الرياضية",
    template: "%s | نظام إدارة الصالة",
  },
  description:
    "نظام متكامل لإدارة الصالات الرياضية — الأعضاء، الاشتراكات، الحضور، الخزائن، والشكاوى.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased bg-gym-bg text-gym-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
