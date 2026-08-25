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
      // لا تعمل redirect هنا — proxy.ts أصلاً بيحمي هذا المسار.
      // لو وصلنا هنا أصلاً، يبقى فيه كوكي صالحة على الأقل، والحالة دي
      // غالبًا مؤقتة أثناء استقرار حالة الـ Auth بعد تسجيل دخول جديد.
      return;
    }
    if (!allow.includes(user.role)) {
      const targetHome = ROLE_HOME[user.role] || "/login";
      router.replace(targetHome);
    }
  }, [user, isLoading, allowKey, router]);

  if (isLoading) return null;
  if (!user || !user.role) return null; // يفضل يعرض null بهدوء، بدون أي navigation فعلي
  if (!allow.includes(user.role)) return null;

  return <>{children}</>;
}
