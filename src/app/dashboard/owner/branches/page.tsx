"use client";

import { useState, useRef, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw,
  Eye,
  Pencil,
  PowerOff,
  Power,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBranches, useUpdateBranch, useDeleteBranch } from "@/features/owner/hooks/useBranches";
import type { BranchDto } from "@/features/owner/types";
import { extractApiError } from "@/lib/utils";

// ── Branch Actions Dropdown ────────────────────────────────────────────────
function BranchActionsMenu({
  branch,
  buttonRef,
  onClose,
}: {
  branch: BranchDto;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 220; // approximate height of menu
      const spaceBelow = window.innerHeight - rect.bottom;
      
      const left = Math.max(10, rect.left);
      
      // If not enough space below, show menu above the button
      const top = spaceBelow < menuHeight
        ? rect.top - menuHeight - 6
        : rect.bottom + 6;

      setCoords({ top, left });
    }
  }, [buttonRef]);

  // Close on outside click or scroll
  useEffect(() => {
    if (showDeleteConfirm) return; // Don't close menu logic while delete modal is open

    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose, buttonRef, showDeleteConfirm]);

  const handleToggleStatus = () => {
    setActionError(null);
    updateMutation.mutate(
      {
        id: branch.id,
        payload: {
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          managerUserId: branch.managerUserId,
          isActive: !branch.isActive,
        },
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          setActionError(extractApiError(err) || "حدث خطأ أثناء تغيير حالة الفرع."),
      }
    );
  };

  const handleDelete = () => {
    setActionError(null);
    deleteMutation.mutate(branch.id, {
      onSuccess: () => onClose(),
      onError: (err) => {
        setActionError(extractApiError(err) || "حدث خطأ أثناء حذف الفرع.");
        setShowDeleteConfirm(false);
      },
    });
  };

  const isLoading = updateMutation.isPending || deleteMutation.isPending;

  return (
    <>
      {/* Floating Dropdown Menu */}
      <div
        ref={menuRef}
        className="fixed z-[9999] w-52 bg-white rounded-2xl border border-zinc-200 shadow-[0_10px_38px_rgba(0,0,0,0.18)] overflow-hidden"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          animation: "fadeSlideIn 0.15s ease",
        }}
      >
        <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {actionError && (
          <div className="px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* View Details */}
        <button
          onClick={() => {
            onClose();
            router.push(`/dashboard/owner/branches/${branch.id}`);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-700 font-cairo hover:bg-zinc-50 transition-colors text-right cursor-pointer"
        >
          <Eye className="h-4 w-4 text-zinc-400 shrink-0" />
          <span>عرض التفاصيل</span>
        </button>

        {/* Edit */}
        <button
          onClick={() => {
            onClose();
            router.push(`/dashboard/owner/branches/${branch.id}/edit`);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-700 font-cairo hover:bg-zinc-50 transition-colors text-right cursor-pointer"
        >
          <Pencil className="h-4 w-4 text-zinc-400 shrink-0" />
          <span>تعديل البيانات</span>
        </button>

        <div className="h-px bg-zinc-100 mx-3" />

        {/* Toggle Status */}
        <button
          onClick={handleToggleStatus}
          disabled={isLoading}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold font-cairo hover:bg-zinc-50 transition-colors text-right cursor-pointer disabled:opacity-50 ${
            branch.isActive ? "text-amber-700" : "text-emerald-700"
          }`}
        >
          {updateMutation.isPending ? (
            <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
          ) : branch.isActive ? (
            <PowerOff className="h-4 w-4 shrink-0" />
          ) : (
            <Power className="h-4 w-4 shrink-0" />
          )}
          <span>{branch.isActive ? "تعطيل الفرع" : "تفعيل الفرع"}</span>
        </button>

        <div className="h-px bg-zinc-100 mx-3" />

        {/* Delete */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 font-cairo hover:bg-red-50 transition-colors text-right cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          <span>حذف الفرع</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center space-y-5 dir-rtl font-tajawal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-zinc-900 font-cairo">تأكيد حذف الفرع</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                هل أنت متأكد من حذف فرع{" "}
                <span className="font-black text-zinc-900">«{branch.name}»</span>؟
                <br />
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="flex-1 h-12 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 font-cairo hover:bg-zinc-50 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black font-cairo transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(220,38,38,0.35)]"
              >
                {deleteMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>نعم، احذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BranchActionButton({
  branch,
  isOpen,
  onToggle,
  onClose,
}: {
  branch: BranchDto;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        id={`branch-menu-btn-${branch.id}`}
        onClick={onToggle}
        className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 transition-colors mx-auto cursor-pointer"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <BranchActionsMenu
          branch={branch}
          buttonRef={buttonRef}
          onClose={onClose}
        />
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: branches, isLoading, error, refetch } = useBranches();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل الفروع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الفروع</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message || "تعذر الاتصال بالخادم."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  const branchList = branches || [];
  const isEmpty = branchList.length === 0;

  const filteredBranches = branchList.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery))
  );

  const activeBranchesCount = branchList.filter((b) => b.isActive).length;
  const inactiveBranchesCount = branchList.filter((b) => !b.isActive).length;

  const totalItems = filteredBranches.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedBranches = filteredBranches.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>الفروع</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              الفروع
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Building2 className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── Condition A: Populated State ── */}
      {!isEmpty && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الفروع</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{branchList.length}</p>
                <p className="text-xs font-bold text-zinc-500 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Building2 className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الفروع النشطة</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeBranchesCount}</p>
                <p className="text-xs font-bold text-amber-600 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الفروع غير النشطة</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{inactiveBranchesCount}</p>
                <p className="text-xs font-bold text-red-600 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <XCircle className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المشتركين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">0</p>
                <p className="text-xs font-bold text-amber-600 mt-1">مشترك</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Users className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الإيرادات (ج.م)</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">0</p>
                <p className="text-xs font-bold text-zinc-400 mt-1">غير محدد</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <DollarSign className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              href="/dashboard/owner/branches/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة فرع جديد</span>
            </Link>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="ابحث عن فرع..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
                />
              </div>
              <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Filter className="h-4 w-4 text-zinc-500" /><span>فلترة</span>
              </button>
              <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Download className="h-4 w-4 text-zinc-500" /><span>تصدير</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                    <th className="py-4 px-4">اسم الفرع</th>
                    <th className="py-4 px-4">العنوان</th>
                    <th className="py-4 px-4">رقم الهاتف</th>
                    <th className="py-4 px-4 text-center">تاريخ الإنشاء</th>
                    <th className="py-4 px-4 text-center">حالة الفرع</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {paginatedBranches.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-zinc-500" />
                          </div>
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.address || "—"}</td>
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">{row.phone || "—"}</td>
                      <td className="py-3.5 px-4 text-center text-zinc-600 font-mono text-xs">
                        {new Date(row.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.isActive ? (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">نشط</span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">غير نشط</span>
                        )}
                      </td>
                      {/* Actions cell */}
                      <td className="py-3.5 px-4 text-center">
                        <BranchActionButton
                          branch={row}
                          isOpen={openMenuId === row.id}
                          onToggle={() => setOpenMenuId((prev) => (prev === row.id ? null : row.id))}
                          onClose={() => setOpenMenuId(null)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-100 bg-white text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-2">
                <span>لكل صفحة</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 focus:outline-none cursor-pointer"
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
                <span>عرض {totalItems === 0 ? 0 : startIndex + 1} - {endIndex} من {totalItems} فرع</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={validCurrentPage === 1}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="h-8 px-3 flex items-center rounded-lg bg-gym-yellow text-gym-black font-black shadow-xs">
                  {validCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={validCurrentPage === totalPages}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Condition B: Empty State ── */}
      {isEmpty && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard/owner/branches/new"
              className="flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة فرع جديد</span>
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Filter className="h-4 w-4 text-zinc-500" /><span>فلترة</span>
              </button>
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Download className="h-4 w-4 text-zinc-500" /><span>تصدير</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6">
            <div className="h-28 w-28 rounded-3xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
              <Building2 className="h-14 w-14 stroke-[1.2]" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-extrabold text-zinc-900 font-cairo">لا يوجد لديك أي فروع حتى الآن</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                أضف أول فرع لبدء إدارة الجيم الخاص بك ومتابعة الأداء والمشتركين والإيرادات.
              </p>
            </div>
            <Link
              href="/dashboard/owner/branches/new"
              className="mt-6 flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة أول فرع</span>
            </Link>
          </div>
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs font-semibold text-amber-950">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <span>يمكنك إضافة أكثر من فرع لاحقاً وإدارة كل فرع بشكل مستقل من لوحة التحكم الخاصة به.</span>
          </div>
        </div>
      )}
    </div>
  );
}
