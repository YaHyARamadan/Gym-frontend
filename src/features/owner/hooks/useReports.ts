import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getRevenueReport,
  getAttendanceReport,
  getMemberGrowthReport,
} from "../api/owner.api";
import { useAuth } from "@/shared/auth/AuthContext";

export function useDashboardOverview(branchId?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["reports", "dashboard", branchId],
    queryFn: () => getDashboardOverview(branchId),
    enabled: !isLoading && isAuthenticated,
  });
}

export function useRevenueReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["reports", "revenue", params],
    queryFn: () => getRevenueReport(params),
    enabled: !isLoading && isAuthenticated,
  });
}

export function useAttendanceReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["reports", "attendance", params],
    queryFn: () => getAttendanceReport(params),
    enabled: !isLoading && isAuthenticated,
  });
}

export function useMemberGrowthReport(branchId?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["reports", "members", branchId],
    queryFn: () => getMemberGrowthReport(branchId),
    enabled: !isLoading && isAuthenticated,
  });
}
