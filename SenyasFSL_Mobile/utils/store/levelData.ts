import { create } from "zustand";

type LevelDataProps = {
  levelID: string;
  levelStep: number;
  totalSteps: number; // ✅ NEW
  setLevelID: (value: string) => void;
  setLevelStep: (value: number) => void;
  setTotalSteps: (value: number) => void; // ✅ NEW
};

export const LevelData = create<LevelDataProps>((set) => ({
  levelID: "",
  levelStep: 0,
  totalSteps: 1, // Default to 1 to prevent division by zero
  setLevelID: (value: string) => set({ levelID: value }),
  setLevelStep: (value: number) => set({ levelStep: value }),
  setTotalSteps: (value: number) => set({ totalSteps: value }), // ✅ NEW
}));