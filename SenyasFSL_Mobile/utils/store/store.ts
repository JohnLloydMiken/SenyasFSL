import { create } from "zustand";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

type PredictionStore = {
  prediction: string;
  setPrediction: (value: string) => void;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
}



export const usePredictionStore = create<PredictionStore>((set) => ({
  prediction: "",
  setPrediction: (value: string) => set({ prediction: value }),
}));
