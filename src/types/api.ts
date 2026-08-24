// ─────────────────────────────────────────────
// Shared API types — mirror the backend contracts
// ─────────────────────────────────────────────

export type UserRole = "Owner" | "BranchManager" | "Reception" | "Coach" | "User";

export interface AuthResultDto {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  errors?: Record<string, string[]>;
  detail?: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  orgId: string;
  branchId?: string;
}

export interface InviteDto {
  id: string;
  email: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  status: "Pending" | "Accepted" | "Revoked";
  expiresAt: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
