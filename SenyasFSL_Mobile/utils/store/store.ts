import { create } from "zustand";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

type PredictionStore = {
  prediction: string;
  confidence: number;
  cameraStatus: string;
  setPrediction: (value: string, confidence?: number) => void;
  setCameraStatus: (status: string) => void;
  reset: () => void;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  prediction: "",
  confidence: 0,
  cameraStatus: "Initializing...",
  
  setPrediction: (value: string, confidence: number = 0) =>
    set({ prediction: value, confidence }),
  
  setCameraStatus: (status: string) =>
    set({ cameraStatus: status }),
  
  reset: () =>
    set({ prediction: "", confidence: 0, cameraStatus: "Show Hand" }),
}));