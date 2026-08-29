import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkInMember,
  checkOutMember,
  getTodayAttendance,
  getMyPayments,
  createPayment,
  requestMemberEdit,
  assignCoach,
  unassignCoach,
  uploadDocument,
  getStoreProducts,
  createStoreOrder,
  getLockers,
  rentLocker,
  releaseLocker,
  getComplaints,
  createComplaint,
  transferComplaintToManager,
  type AttendanceCheckInPayload,
  type AttendanceSummaryDto,
  type MemberEditRequestPayload,
  type AssignCoachPayload,
  type UploadDocumentPayload,
  type CreateStoreOrderPayload,
  type RentLockerPayload,
  type CreateComplaintPayload,
} from "../api/reception.api";

// ── Attendance ────────────────────────────────────────────────────────────────────────
export { type AttendanceSummaryDto };

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: () => getTodayAttendance({ pageSize: 100 }),
    refetchInterval: 30_000, // auto-refresh every 30 seconds
  });
}

export function useCheckInMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AttendanceCheckInPayload) => checkInMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useCheckOutMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attendanceRecordId: string) => checkOutMember(attendanceRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
  });
}

// ── My Payments ────────────────────────────────────────────────────────────
export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "mine"],
    queryFn: getMyPayments,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "mine"] });
    },
  });
}

// ── Member Edit Requests ───────────────────────────────────────────────────
export function useRequestMemberEdit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MemberEditRequestPayload) => requestMemberEdit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

// ── Coaches ────────────────────────────────────────────────────────────────
export function useAssignCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignCoachPayload) => assignCoach(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useUnassignCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => unassignCoach(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

// ── Documents ──────────────────────────────────────────────────────────────
export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// ── Store ──────────────────────────────────────────────────────────────────
export function useStoreProducts() {
  return useQuery({
    queryKey: ["store", "products"],
    queryFn: getStoreProducts,
  });
}

export function useCreateStoreOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStoreOrderPayload) => createStoreOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", "products"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "mine"] });
    },
  });
}

// ── Lockers ────────────────────────────────────────────────────────────────
export function useLockers() {
  return useQuery({
    queryKey: ["lockers"],
    queryFn: getLockers,
  });
}

export function useRentLocker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RentLockerPayload) => rentLocker(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "mine"] });
    },
  });
}

export function useReleaseLocker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lockerId: string) => releaseLocker(lockerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
    },
  });
}

// ── Complaints ─────────────────────────────────────────────────────────────
export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getComplaints,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) => createComplaint(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}

export function useTransferComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (complaintId: string) => transferComplaintToManager(complaintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}
