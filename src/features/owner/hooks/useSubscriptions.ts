import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscriptions,
  createSubscription,
  getMembershipPlans,
  renewSubscription,
  freezeSubscription,
  resumeSubscription,
  cancelSubscription,
  type CreateSubscriptionPayload,
} from "../api/owner.api";
import { useAuth } from "@/shared/auth/AuthContext";

export function useMembershipPlans() {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => getMembershipPlans(),
    enabled: !isLoading && isAuthenticated,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) => createSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

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
    mutationFn: (payload: Parameters<typeof renewSubscription>[0]) => renewSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
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
