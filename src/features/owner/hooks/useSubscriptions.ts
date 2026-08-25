import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscriptions,
  renewSubscription,
  freezeSubscription,
  resumeSubscription,
  cancelSubscription,
} from "../api/owner.api";
import { useAuth } from "@/shared/auth/AuthContext";

export function useSubscriptions(params?: {
  branchId?: string;
  searchTerm?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptions(params),
    enabled: !isLoading && isAuthenticated,
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => renewSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useFreezeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => freezeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
