import { redirect } from "next/navigation";

/**
 * /dashboard — generic dashboard redirect.
 * The actual redirect destination is determined client-side by AuthContext based on role.
 * This page exists to satisfy the middleware matcher.
 */
export default function DashboardRootPage() {
  redirect("/dashboard/owner");
}
