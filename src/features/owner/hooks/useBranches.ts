import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../api/owner.api";
import type { CreateBranchPayload, UpdateBranchPayload } from "../types";

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });
}

export function useBranch(id?: string) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => (id ? getBranchById(id) : Promise.reject("No ID provided")),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBranchPayload) => createBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBranchPayload }) =>
      updateBranch(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
