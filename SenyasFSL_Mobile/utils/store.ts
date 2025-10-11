import { create } from "zustand";

type PredictionStore = {
  prediction: string;
  setPrediction: (value: string) => void;
};

export const usePredictionStore = create<PredictionStore>((set) => ({
  prediction: "",
  setPrediction: (value: string) => set({ prediction: value }),
}));
