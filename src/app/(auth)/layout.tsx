import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "تسجيل الدخول",
    template: "%s | نظام إدارة الصالة",
  },
};

/**
 * Auth layout — centered card on gradient background.
 * Shared by /login, /signup, /accept-invite.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-bg min-h-screen flex items-center justify-center p-4">
      {/* Decorative top-left shape */}
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 w-96 h-96 rounded-full bg-gym-yellow/5 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"
      />
      {/* Decorative bottom-right shape */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 w-72 h-72 rounded-full bg-gym-black/3 translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 w-full animate-card-enter">
        {children}
      </div>
    </main>
  );
}
