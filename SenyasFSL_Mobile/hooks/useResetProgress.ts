// hooks/useResetProgress.ts
import { useMutation } from "@tanstack/react-query";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Alert } from "react-native";
import { reauthenticateUser, logoutUser } from "@/services/AuthService";
import { useUserStore } from "@/utils/store/useUserStore";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

// Initialize Firebase Functions
const functions = getFunctions();
const resetProgressFn = httpsCallable(functions, "resetUserProgress");

export const useResetProgress = () => {
  const { clearUserData } = useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (password: string) => {
      // 1. Re-authenticate
      await reauthenticateUser(password);

      // 2. Call cloud function
      await resetProgressFn();

      return true;
    },

    onSuccess: async () => {
      Alert.alert("Success", "Your progress has been reset!");

      // 3. Clear Zustand user data
      clearUserData();

      // 4. Clear TanStack Query cache
      queryClient.clear();

      // 5. Logout the user
      await logoutUser();

      // 6. Redirect to login page
      router.replace("./(auth)/");
    },

    onError: (err: any) => {
      const message = err?.message || "An unknown error occurred.";
      Alert.alert("Error", message);
      console.error("Progress reset failed:", err);
    },
  });
};
