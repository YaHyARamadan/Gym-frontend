import type { Metadata } from "next";
import RoleGuard from "@/shared/auth/RoleGuard";
import { ReceptionSidebar } from "@/features/dashboard/components/ReceptionSidebar";
import { OwnerTopbar } from "@/features/dashboard/components/OwnerTopbar";

export const metadata: Metadata = {
  title: "لوحة تحكم موظف الاستقبال | Reception Dashboard",
};

export default function ReceptionDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["Reception", "BranchManager", "Owner"]}>
      <div className="dash-shell flex flex-row w-full min-h-screen bg-zinc-100" dir="rtl">
        <ReceptionSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <OwnerTopbar />
          <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
