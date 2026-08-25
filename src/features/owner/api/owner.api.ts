import apiClient from "@/shared/api/client";
import type {
  BranchDto,
  CreateBranchPayload,
  UpdateBranchPayload,
  InviteDto,
  CreateInvitePayload,
  UserDto,
  MemberSummaryDto,
  CreateMemberPayload,
  PaymentSummaryDto,
  DashboardOverviewDto,
  RevenueReportDto,
  AttendanceReportDto,
  MemberGrowthReportDto,
  SubscriptionSummaryDto,
  NotificationDto,
  PaginatedList,
} from "../types";

// ── Branches ─────────────────────────────────────────────────────────────
export async function getBranches(): Promise<BranchDto[]> {
  const res = await apiClient.get<BranchDto[]>("/api/branches");
  return res.data;
}

export async function getBranchById(id: string): Promise<BranchDto> {
  const res = await apiClient.get<BranchDto>(`/api/branches/${id}`);
  return res.data;
}

export async function createBranch(payload: CreateBranchPayload): Promise<string> {
  const res = await apiClient.post<string>("/api/branches", payload);
  return res.data;
}

export async function updateBranch(id: string, payload: UpdateBranchPayload): Promise<void> {
  await apiClient.put(`/api/branches/${id}`, payload);
}

export async function deleteBranch(id: string): Promise<void> {
  await apiClient.delete(`/api/branches/${id}`);
}

// ── Invites ──────────────────────────────────────────────────────────────
export async function createInvite(payload: CreateInvitePayload): Promise<{ token: string }> {
  const res = await apiClient.post<{ token: string }>("/api/invites", payload);
  return res.data;
}

export async function getPendingInvites(): Promise<InviteDto[]> {
  const res = await apiClient.get<InviteDto[]>("/api/invites/pending");
  return res.data;
}

export async function revokeInvite(id: string): Promise<void> {
  await apiClient.delete(`/api/invites/${id}`);
}

// ── Users (Staff) ────────────────────────────────────────────────────────
export async function getUsers(branchId?: string): Promise<UserDto[]> {
  const res = await apiClient.get<UserDto[]>("/api/users", {
    params: { branchId },
  });
  return res.data;
}

export async function deactivateUser(id: string): Promise<void> {
  await apiClient.patch(`/api/users/${id}/deactivate`);
}

// ── Members ──────────────────────────────────────────────────────────────
export async function getMembers(params?: {
  branchId?: string;
  searchTerm?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PaginatedList<MemberSummaryDto>> {
  const res = await apiClient.get<PaginatedList<MemberSummaryDto>>("/api/members", { params });
  return res.data;
}

export async function createMember(payload: CreateMemberPayload): Promise<string> {
  const res = await apiClient.post<string>("/api/members", payload);
  return res.data;
}

export async function deactivateMember(id: string): Promise<void> {
  await apiClient.patch(`/api/members/${id}/deactivate`);
}

// ── Payments ─────────────────────────────────────────────────────────────
export async function getPayments(params?: {
  branchId?: string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PaginatedList<PaymentSummaryDto>> {
  const res = await apiClient.get<PaginatedList<PaymentSummaryDto>>("/api/payments", { params });
  return res.data;
}

export async function refundPayment(id: string, reason: string): Promise<void> {
  await apiClient.post(`/api/payments/${id}/refund`, { reason });
}

// ── Reports ──────────────────────────────────────────────────────────────
export async function getDashboardOverview(branchId?: string): Promise<DashboardOverviewDto> {
  const res = await apiClient.get<DashboardOverviewDto>("/api/reports/dashboard", {
    params: { branchId },
  });
  return res.data;
}

export async function getRevenueReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<RevenueReportDto> {
  const res = await apiClient.get<RevenueReportDto>("/api/reports/revenue", { params });
  return res.data;
}

export async function getAttendanceReport(params?: {
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<AttendanceReportDto> {
  const res = await apiClient.get<AttendanceReportDto>("/api/reports/attendance", { params });
  return res.data;
}

export async function getMemberGrowthReport(branchId?: string): Promise<MemberGrowthReportDto> {
  const res = await apiClient.get<MemberGrowthReportDto>("/api/reports/members", {
    params: { branchId },
  });
  return res.data;
}

// ── Subscriptions ────────────────────────────────────────────────────────
export async function getSubscriptions(params?: {
  branchId?: string;
  searchTerm?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PaginatedList<SubscriptionSummaryDto>> {
  const res = await apiClient.get<PaginatedList<SubscriptionSummaryDto>>("/api/subscriptions", {
    params,
  });
  return res.data;
}

export async function renewSubscription(id: string): Promise<void> {
  await apiClient.post(`/api/subscriptions/${id}/renew`);
}

export async function freezeSubscription(id: string): Promise<void> {
  await apiClient.patch(`/api/subscriptions/${id}/freeze`);
}

export async function resumeSubscription(id: string): Promise<void> {
  await apiClient.patch(`/api/subscriptions/${id}/resume`);
}

export async function cancelSubscription(id: string): Promise<void> {
  await apiClient.patch(`/api/subscriptions/${id}/cancel`);
}

// ── Notifications ────────────────────────────────────────────────────────
export async function getNotifications(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<PaginatedList<NotificationDto>> {
  const res = await apiClient.get<PaginatedList<NotificationDto>>("/api/notifications", {
    params,
  });
  return res.data;
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const res = await apiClient.get<number>("/api/notifications/unread-count");
  return res.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch("/api/notifications/read-all");
}
