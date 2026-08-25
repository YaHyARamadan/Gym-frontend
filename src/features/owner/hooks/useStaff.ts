import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deactivateUser, createInvite, getPendingInvites, revokeInvite } from "../api/owner.api";
import type { CreateInvitePayload } from "../types";

export function useUsers(branchId?: string) {
  return useQuery({
    queryKey: ["users", branchId],
    queryFn: () => getUsers(branchId),
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function usePendingInvites() {
  return useQuery({
    queryKey: ["invites", "pending"],
    queryFn: getPendingInvites,
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvitePayload) => createInvite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", "pending"] });
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", "pending"] });
    },
  });
}
