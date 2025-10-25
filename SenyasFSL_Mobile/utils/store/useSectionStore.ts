import { create } from "zustand";

interface SectionState {
  currentSectionOrder: number | null;
  setSectionOrder: (order: number) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  currentSectionOrder: null,
  setSectionOrder: (order) => set({ currentSectionOrder: order }),
}));
