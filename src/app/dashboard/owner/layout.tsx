import type { Metadata } from "next";
import RoleGuard from "@/shared/auth/RoleGuard";
import { OwnerSidebar } from "@/features/dashboard/components/OwnerSidebar";
import { OwnerTopbar } from "@/features/dashboard/components/OwnerTopbar";

export const metadata: Metadata = {
  title: "لوحة تحكم المالك",
};

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["Owner"]}>
      <div className="dash-shell flex">
        <OwnerSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <OwnerTopbar />
          <main className="flex-1 p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
