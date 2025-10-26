import { create } from "zustand";

type VideoSpeedProps = {
  playingSpeed: number;
  setSpeed: (value: number) => void;
};





export const videoSpeed = create<VideoSpeedProps>((set) => ({
  playingSpeed: 1,
  setSpeed: (value: number) => set({ playingSpeed: value }),
}));
