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

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [user, isLoading, allow, router]);

  if (isLoading) return null;
  if (!user || !allow.includes(user.role)) return null;

  return <>{children}</>;
}
