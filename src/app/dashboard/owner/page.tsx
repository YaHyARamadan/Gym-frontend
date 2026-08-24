"use client";

import { Users, Building2, Wallet, TrendingUp, Plus, UserPlus, ArrowUpLeft } from "lucide-react";
import { StatCard, Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";

const STATS = [
  { label: "إجمالي الأعضاء", value: "1,248", icon: <Users className="h-5 w-5" /> },
  { label: "الفروع النشطة", value: "4", icon: <Building2 className="h-5 w-5" /> },
  { label: "إيرادات هذا الشهر", value: "186,400 ج.م", icon: <TrendingUp className="h-5 w-5" />, financialType: "income" as const },
  { label: "مصروفات هذا الشهر", value: "42,900 ج.م", icon: <Wallet className="h-5 w-5" />, financialType: "expense" as const },
];

const BRANCHES = [
  { name: "فرع المعادي", members: 412, status: "active" as const },
  { name: "فرع مدينة نصر", members: 356, status: "active" as const },
  { name: "فرع الشيخ زايد", members: 298, status: "active" as const },
  { name: "فرع الإسكندرية", members: 182, status: "pending" as const },
];

const ACTIVITY = [
  { text: "انضم عضو جديد — أحمد سامي إلى فرع المعادي", time: "منذ 12 دقيقة" },
  { text: "تم قبول دعوة مدرب — سارة يوسف إلى فرع مدينة نصر", time: "منذ ساعة" },
  { text: "تم تجديد اشتراك — 18 عضو في فرع الشيخ زايد", time: "منذ 3 ساعات" },
  { text: "فاتورة إيجار مستحقة — فرع الإسكندرية", time: "أمس" },
];

const STATUS_LABEL: Record<"active" | "pending", string> = {
  active: "نشط",
  pending: "قيد الإعداد",
};

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Branches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الفروع</CardTitle>
            <Button variant="secondary" size="sm">
              <Plus className="h-3.5 w-3.5" />
              فرع جديد
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gym-border">
              {BRANCHES.map((b) => (
                <li key={b.name} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-9 w-9 rounded-lg bg-gym-yellow-tint flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-gym-black" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gym-black truncate">{b.name}</p>
                      <p className="text-xs text-gym-text-secondary">{b.members} عضو</p>
                    </div>
                  </div>
                  <Badge variant={b.status}>{STATUS_LABEL[b.status]}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Button variant="secondary" className="justify-between">
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                دعوة موظف أو مدرب
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 opacity-50" />
            </Button>
            <Button variant="secondary" className="justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                إضافة فرع جديد
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 opacity-50" />
            </Button>
            <Button variant="secondary" className="justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                تسجيل عضو جديد
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>أحدث النشاطات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-gym-border">
            {ACTIVITY.map((a) => (
              <li key={a.text} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <p className="text-sm text-gym-black">{a.text}</p>
                <span className="text-xs text-gym-text-secondary whitespace-nowrap">{a.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
