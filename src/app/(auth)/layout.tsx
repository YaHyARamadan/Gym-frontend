import type { Metadata } from "next";
import { PlateStackDecor } from "@/shared/ui/BrandMark";

export const metadata: Metadata = {
  title: {
    default: "تسجيل الدخول",
    template: "%s | نظام إدارة الصالة",
  },
};

/**
 * Auth layout — dark "gym floor" backdrop shared by /login, /signup, /accept-invite.
 * Layered grid + glow + plate silhouettes + grain replace the old flat background;
 * the white card floats above it all.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-shell">
      <div className="auth-topstripe" aria-hidden="true" />

      <div className="auth-glow auth-glow--yellow" aria-hidden="true" />
      <div className="auth-glow auth-glow--maroon" aria-hidden="true" />

      <PlateStackDecor className="auth-plates auth-plates--left hidden md:block" />
      <PlateStackDecor className="auth-plates auth-plates--right hidden md:block" />

      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </main>
  );
}
