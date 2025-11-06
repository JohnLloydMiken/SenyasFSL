import {
    markFirestoreVerified,
    recordActivity,
} from "@/services/userService";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to call the 'recordActivity' cloud function.
 * This also invalidates the user query to refetch their profile (e.g., to show an updated streak).
 */
export function useRecordActivityMutation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: recordActivity, // The async function to call
    onSuccess: () => {
      // When successful, refetch the user data
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    },
    onError: (error) => {
      console.error("Error recording activity:", error);
      // You could show a toast message here
    },
  });
}

/**
 * Hook to call the 'markFirestoreVerified' cloud function.
 * This also invalidates the user query to refetch their profile.
 */
export function useMarkVerifiedMutation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: markFirestoreVerified,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    },
    onError: (error) => {
      console.error("Error marking verified:", error);
    },
  });
}