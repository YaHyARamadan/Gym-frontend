"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/types/api";
import { useAuth } from "./AuthContext";

const ROLE_HOME: Record<UserRole, string> = {
  Owner: "/dashboard/owner",
  BranchManager: "/dashboard/branch-manager",
  Reception: "/dashboard/reception",
  Coach: "/dashboard/coach",
  User: "/login",
};

interface RoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
}

/**
 * Wrap any page/component with <RoleGuard allow={['Owner']}>
 * Users whose role is not in the allow list are redirected to their own dashboard.
 */
export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allowKey = allow.join(",");

  useEffect(() => {
    if (isLoading) return;
    if (!user || !user.role) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      const targetHome = ROLE_HOME[user.role] || "/login";
      if (targetHome !== window.location.pathname) {
        router.replace(targetHome);
      }
    }
  }, [user, isLoading, allowKey, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 font-tajawal dir-rtl">
        <div className="h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo mt-3">جاري فتح لوحة التحكم...</p>
      </div>
    );
  }

  return <>{children}</>;
}
