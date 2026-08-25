import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getRevenueReport,
  getAttendanceReport,
  getMemberGrowthReport,
} from "../api/owner.api";

export function useDashboardOverview(branchId?: string) {
  return useQuery({
    queryKey: ["reports", "dashboard", branchId],
    queryFn: () => getDashboardOverview(branchId),
  });
}

export function useRevenueReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: ["reports", "revenue", params],
    queryFn: () => getRevenueReport(params),
  });
}

export function useAttendanceReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: ["reports", "attendance", params],
    queryFn: () => getAttendanceReport(params),
  });
}

export function useMemberGrowthReport(branchId?: string) {
  return useQuery({
    queryKey: ["reports", "members", branchId],
    queryFn: () => getMemberGrowthReport(branchId),
  });
}
