import { create } from "zustand";

type UserPoints = {
  score: number;
  incrementScore: () => void; // ✅ Add an increment action
  setScore: (value: number) => void;
  resetScore: ()=> void
};

export const useUserPoints = create<UserPoints>((set) => ({
  score: 0,
  // ✅ Implement the increment action
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  setScore: (value: number) => set({ score: value }),
  resetScore: () => set({score: 0}),
}));