import type { Metadata } from "next";
import RoleGuard from "@/shared/auth/RoleGuard";
import { CoachSidebar } from "@/features/dashboard/components/CoachSidebar";
import { OwnerTopbar } from "@/features/dashboard/components/OwnerTopbar";

export const metadata: Metadata = {
  title: "لوحة تحكم الكوتش | Coach Dashboard",
};

export default function CoachDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["Coach", "BranchManager", "Owner"]}>
      <div className="dash-shell flex flex-row w-full min-h-screen bg-zinc-100" dir="rtl">
        <CoachSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <OwnerTopbar />
          <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
