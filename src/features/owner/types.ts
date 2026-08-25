// User roles matching backend Domain.Enums.UserRole
export type UserRole = "Owner" | "BranchManager" | "Coach" | "Reception" | "Member";

// Gender matching backend Domain.Enums.Gender
export type Gender = "Male" | "Female";

// Generic PaginatedList matching backend PaginatedList<T>
export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ── Branches ──
export interface BranchDto {
  id: string;
  orgId: string;
  name: string;
  address?: string;
  phone?: string;
  managerUserId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBranchPayload {
  name: string;
  address?: string;
  phone?: string;
  managerUserId?: string;
}

export interface UpdateBranchPayload {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  managerUserId?: string;
}

// ── Invites ──
export interface InviteDto {
  id: string;
  email: string;
  role: UserRole;
  orgId: string;
  branchId?: string;
  status: "Pending" | "Accepted" | "Expired" | "Revoked";
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitePayload {
  email: string;
  role: UserRole;
  branchId?: string;
}

// ── Users (Staff) ──
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  orgId: string;
  branchId?: string;
  isActive: boolean;
  createdAt: string;
}

// ── Members ──
export interface MemberSummaryDto {
  id: string;
  memberNumber: string;
  fullName: string;
  phone: string;
  gender: Gender;
  isActive: boolean;
  branchId: string;
}

export interface CreateMemberPayload {
  fullName: string;
  phone: string;
  gender: Gender;
  branchId: string;
  email?: string;
  nationalId?: string;
}

// ── Payments ──
export type PaymentMethod = "Cash" | "CreditCard" | "BankTransfer" | "Other";
export type PaymentStatus = "Pending" | "Completed" | "Failed" | "Refunded";

export interface PaymentSummaryDto {
  id: string;
  memberId: string;
  memberFullName: string;
  memberNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt: string;
}

// ── Reports ──
export interface DashboardOverviewDto {
  totalMembers: number;
  activeMembers: number;
  inactiveMembersCount: number;
  expiredMembersCount: number;
  newMembersThisMonth: number;
  monthlyRevenue: number;
  storeRevenueThisMonth: number;
  monthlyExpenses: number;
  netProfit: number;
  todayAttendanceCount: number;
  expiringSubscriptionsCount: number;
  lowStockProductsCount: number;
}

export interface MemberGrowthReportDto {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  expiredMembers: number;
  newMembersThisMonth: number;
  newMembersThisWeek: number;
  newMembersToday: number;
}

export interface PaymentMethodRevenueDto {
  method: PaymentMethod;
  methodName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface BranchRevenueDto {
  branchId?: string;
  branchName: string;
  totalAmount: number;
}

export interface RevenueReportDto {
  totalRevenue: number;
  totalTransactions: number;
  methodBreakdown: PaymentMethodRevenueDto[];
  branchBreakdown: BranchRevenueDto[];
}

export interface PeakHourDto {
  hourOfDay: number;
  timeSlot: string;
  attendanceCount: number;
}

export interface TopActiveMemberDto {
  memberId: string;
  memberFullName: string;
  memberNumber: string;
  checkInCount: number;
}

export interface AttendanceReportDto {
  totalCheckIns: number;
  uniqueMembersAttended: number;
  peakHours: PeakHourDto[];
  topMembers: TopActiveMemberDto[];
}

// ── Subscriptions ──
export type SubscriptionStatus = "Active" | "Expired" | "Frozen" | "Cancelled" | "Pending";

export interface SubscriptionSummaryDto {
  id: string;
  memberId: string;
  memberFullName: string;
  memberNumber: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
}

// ── Notifications ──
export type NotificationType = "System" | "Subscription" | "Payment" | "Member" | "Security";
export type NotificationChannel = "InApp" | "Email" | "SMS" | "Push";

export interface NotificationDto {
  id: string;
  organizationId: string;
  branchId?: string;
  userId?: string;
  memberId?: string;
  memberFullName?: string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
