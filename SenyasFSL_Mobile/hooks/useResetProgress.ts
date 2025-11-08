import { useMutation } from "@tanstack/react-query";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Alert } from "react-native";
import { reauthenticateUser } from "@/services/AuthService"; // Import from your service
import { useUserStore } from "@/utils/store/useUserStore"; // Import your user store

// Initialize Firebase Functions
const functions = getFunctions();
const resetProgressFn = httpsCallable(functions, "resetUserProgress");

export const useResetProgress = () => {
  const { clearUserData } = useUserStore(); // Get the clear function

  return useMutation({
    mutationFn: async (password: string) => {
      // 1. Re-authenticate first
      await reauthenticateUser(password);
      
      // 2. If successful, call the cloud function
      return await resetProgressFn();
    },

    onSuccess: () => {
      Alert.alert("Success", "Your progress has been reset!");
      // Clear local user data from Zustand store to force a refresh
      clearUserData();
    },

    onError: (err: any) => {
      const message = err.message || "An unknown error occurred.";
      Alert.alert("Error", message);
      console.error("Progress reset failed:", err);
    },
  });
};