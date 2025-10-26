import { create } from "zustand";

type LevelDataProps = {
  levelID: string;
  levelStep: number,
  setLevelID: (value: string) => void;
  setLevelStep: (value: number) => void;
};

export const LevelData = create<LevelDataProps>((set) => ({
   levelID: "",
  levelStep: 0,
  setLevelID: (value: string) => set({ levelID: value }),
   setLevelStep: (value: number) => set({ levelStep: value }),
}));
