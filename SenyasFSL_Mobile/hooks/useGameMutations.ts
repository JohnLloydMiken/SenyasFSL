// hooks/useGameMutations.ts
import { buyItem, openChest } from "@/services/gameService"; //
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useGameMutations = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // The hook for buying an item
  const useBuyItemMutation = () => {
    return useMutation({
      mutationFn: (variables: { itemId: string; itemCost: number }) =>
        buyItem(variables.itemId, variables.itemCost), //
      
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Purchase Successful!",
        });
        
        // ✅ THIS SOLVES YOUR COIN PROBLEM
        // It tells TanStack Query: "The user's data is stale, refresh it!"
        // This will update the data in _layout.tsx AND treasure.tsx
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      },
      onError: (error: Error) => {
        Toast.show({
          type: "error",
          text1: "Purchase Failed",
          text2: error.message || "An unknown error occurred.",
        });
      },
    });
  };

  // The hook for opening a chest
  const useOpenChestMutation = () => {
    return useMutation({
      mutationFn: (prizeId: string) => openChest(prizeId), //
      
      onSuccess: () => {
        // The treasure.tsx component will handle showing the modal
        // We just need to invalidate the data
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      },
      onError: (error: Error) => {
        Toast.show({
          type: "error",
          text1: "Failed to Open Chest",
          text2: error.message || "An unknown error occurred.",
        });
      },
    });
  };

  return { useBuyItemMutation, useOpenChestMutation };
};