import { redirect } from "next/navigation";

/**
 * /dashboard — generic dashboard redirect.
 * The actual redirect destination is determined client-side by AuthContext based on role.
 * This page exists to satisfy the middleware matcher.
 */
export default function DashboardRootPage() {
  // Will be redirected by middleware if not authenticated
  // Client-side RoleGuard handles further role-based routing
  redirect("/login");
}
