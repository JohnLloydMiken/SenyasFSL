// src/utils/store/useAchievementStore.ts
import { create } from "zustand";
import { ContentAchievement } from "@/shared/types"; // Adjust path if needed
import { getAllAchievements } from "@/services/achievementService"; // Adjust path if needed

interface AchievementStoreState {
  allAchievements: ContentAchievement[];
  isLoading: boolean;
  error: string | null;
  fetchAchievements: () => Promise<void>;
}

export const useAchievementStore = create<AchievementStoreState>((set, get) => ({
  allAchievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    // If we already have data or are already loading, don't fetch again
    if (get().allAchievements.length > 0 || get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const achievements = await getAllAchievements();
      set({ allAchievements: achievements, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
      set({ error: "Failed to load achievements", isLoading: false });
    }
  },
}));