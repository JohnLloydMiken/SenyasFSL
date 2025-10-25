// SenyasFSLMobile/hooks/useSaveProgress.ts
import { useState } from "react";
import { useUserStore } from "@/utils/store/useUserStore";
import { useAuthStore } from "@/utils/store/useAuthStore"; // ✅ 1. Import the Auth store
import { saveLevelProgress as callSaveApi } from "@/services/gameService";
import { CompleteLevelData, UserProfileData } from "@/shared/types";
import Toast from "react-native-toast-message";

export const useSaveProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get state and updaters from the User store
  const { userData, updateUserData, fetchUserData } = useUserStore();
  
  // ✅ 2. Get the auth 'user' object from the Auth store
  const { user } = useAuthStore();

  /**
   * This function mimics the behavior of React Query's `useMutation`
   * using your Zustand store.
   */
  const mutate = async (
    saveData: CompleteLevelData,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    setIsLoading(true);

    // 1. Snapshot the current user data for rollback
    const previousUserData = userData;

    // 2. Calculate the optimistic state
    const { xpGained, senyasCoinsGained, chestsEarned } = saveData;
    if (previousUserData) {
      const newOptimisticData: Partial<UserProfileData> = {
        xp: (previousUserData.xp || 0) + xpGained,
        senyasCoins: (previousUserData.senyasCoins || 0) + senyasCoinsGained,
        chestCount: (previousUserData.chestCount || 0) + chestsEarned,
      };

      // 3. OPTIMISTIC UPDATE: Update the Zustand store immediately
      updateUserData(newOptimisticData);
    }

    try {
      // 4. Call the actual API
      await callSaveApi(saveData);

      // 5. ON SUCCESS: Run the success callback
      options?.onSuccess?.();

      // 6. SYNC: Silently refetch the user's data from the server
      // to get the "official" state (including new streak, etc.)
      
      // ✅ 3. THE FIX: Use the 'user' object from useAuthStore
      if (user) {
        // This 'user' is the Firebase User object that fetchUserData expects
        fetchUserData(user);
      }
      
    } catch (error) {
      // 7. ON ERROR: Roll back to the previous state
      console.error("useSaveProgress: Failed to save progress:", error);
      Toast.show({
        type: "error",
        text1: "Save Error",
        text2: "Could not save your progress. Please try again.",
      });

      if (previousUserData) {
        updateUserData(previousUserData);
      }
      options?.onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};