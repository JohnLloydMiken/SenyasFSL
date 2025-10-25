// src/stores/audioStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  music: number;
  sfx: number;
  setMusic: (level: number) => void;
  setSfx: (level: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      music: 60,
      sfx: 80,
      setMusic: (level) => set({ music: level }),
      setSfx: (level) => set({ sfx: level }),
    }),
    {
      name: "audio-settings",
    }
  )
);
