import apiClient from "@/shared/api/client";
import type { PaginatedList, MemberSummaryDto, PaymentSummaryDto } from "@/features/owner/types";

export interface AttendanceCheckInPayload {
  memberId: string;
  method?: "Manual" | "QrCode" | "Fingerprint"; // CheckInMethod enum, defaults to Manual
}

// Matches backend AttendanceSummaryDto exactly
export interface AttendanceSummaryDto {
  id: string;
  memberId: string;
  memberFullName: string;   // NOT memberName
  memberNumber: string;
  checkInAt: string;         // NOT checkInTime
  checkOutAt?: string | null; // NOT checkOutTime
  method: "Manual" | "QrCode" | "Fingerprint";
}

export interface MemberEditRequestPayload {
  memberId: string;
  fieldToEdit: string;
  newValue: string;
  reason?: string;
}

export interface AssignCoachPayload {
  memberId: string;
  coachId: string;
}

export interface UploadDocumentPayload {
  memberId: string;
  documentType: "NationalId" | "Contract" | "Medical" | "Other";
  title: string;
  fileUrl: string;
}

export interface StoreProductDto {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category?: string;
}

export interface CreateStoreOrderPayload {
  memberId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface LockerDto {
  id: string;
  lockerNumber: string;
  status: "Available" | "Rented" | "Maintenance";
  rentedByMemberName?: string;
  rentalEndDate?: string;
}

export interface RentLockerPayload {
  lockerId: string;
  memberId: string;
  durationMonths: number;
  amount: number;
}

export interface ComplaintDto {
  id: string;
  memberName: string;
  subject: string;
  description: string;
  status: "Pending" | "Transferred" | "Resolved";
  createdAt: string;
}

export interface CreateComplaintPayload {
  memberName: string;
  memberId?: string;
  subject: string;
  description: string;
}

// ── Attendance ──────────────────────────────────────────────────────────────────────────
const jsonHeaders = { headers: { "Content-Type": "application/json" } };

/** POST /api/attendance/check-in  — body: { MemberId, Method? } */
export async function checkInMember(payload: AttendanceCheckInPayload): Promise<AttendanceSummaryDto> {
  const res = await apiClient.post<AttendanceSummaryDto>(
    "/api/attendance/check-in",
    { MemberId: payload.memberId, Method: payload.method ?? "Manual" },
    jsonHeaders
  );
  return res.data;
}

/** POST /api/attendance/{attendanceRecordId}/check-out  — id in route, no body */
export async function checkOutMember(attendanceRecordId: string): Promise<AttendanceSummaryDto> {
  const res = await apiClient.post<AttendanceSummaryDto>(
    `/api/attendance/${attendanceRecordId}/check-out`,
    null,                // no body
    jsonHeaders
  );
  return res.data;
}

/** GET /api/attendance/today  — returns PaginatedList<AttendanceSummaryDto> */
export async function getTodayAttendance(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<import("@/features/owner/types").PaginatedList<AttendanceSummaryDto>> {
  const res = await apiClient.get<import("@/features/owner/types").PaginatedList<AttendanceSummaryDto>>(
    "/api/attendance/today",
    { params: { pageNumber: params?.pageNumber ?? 1, pageSize: params?.pageSize ?? 50 } }
  );
  return res.data;
}

// ── My Payments ────────────────────────────────────────────────────────────
export async function getMyPayments(): Promise<PaymentSummaryDto[]> {
  const res = await apiClient.get<PaymentSummaryDto[]>("/api/payments/mine");
  return res.data;
}

export async function createPayment(payload: {
  memberId: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}): Promise<void> {
  await apiClient.post("/api/payments", payload);
}

// ── Member Edit Requests ───────────────────────────────────────────────────
export async function requestMemberEdit(payload: MemberEditRequestPayload): Promise<void> {
  await apiClient.post(`/api/members/${payload.memberId}/request-edit`, payload);
}

// ── Coaches ────────────────────────────────────────────────────────────────
export async function assignCoach(payload: AssignCoachPayload): Promise<void> {
  await apiClient.post("/api/coaches/assign", payload);
}

export async function unassignCoach(memberId: string): Promise<void> {
  await apiClient.post("/api/coaches/unassign", { memberId });
}

// ── Documents ──────────────────────────────────────────────────────────────
export async function uploadDocument(payload: UploadDocumentPayload): Promise<void> {
  await apiClient.post("/api/documents", payload);
}

// ── Store ──────────────────────────────────────────────────────────────────
export async function getStoreProducts(): Promise<StoreProductDto[]> {
  const res = await apiClient.get<StoreProductDto[]>("/api/store/products");
  return res.data;
}

export async function createStoreOrder(payload: CreateStoreOrderPayload): Promise<void> {
  await apiClient.post("/api/store/orders", payload);
}

// ── Lockers ────────────────────────────────────────────────────────────────
export async function getLockers(): Promise<LockerDto[]> {
  const res = await apiClient.get<LockerDto[]>("/api/lockers");
  return res.data;
}

export async function rentLocker(payload: RentLockerPayload): Promise<void> {
  await apiClient.post(`/api/lockers/${payload.lockerId}/rent`, payload);
}

export async function releaseLocker(lockerId: string): Promise<void> {
  await apiClient.post(`/api/lockers/${lockerId}/release`);
}

// ── Complaints ─────────────────────────────────────────────────────────────
export async function getComplaints(): Promise<ComplaintDto[]> {
  const res = await apiClient.get<ComplaintDto[]>("/api/complaints");
  return res.data;
}

export async function createComplaint(payload: CreateComplaintPayload): Promise<void> {
  await apiClient.post("/api/complaints", payload);
}

export async function transferComplaintToManager(complaintId: string): Promise<void> {
  await apiClient.post(`/api/complaints/${complaintId}/transfer`);
}
