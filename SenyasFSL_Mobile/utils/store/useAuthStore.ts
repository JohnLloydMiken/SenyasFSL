// src/store/useAuthStore.ts
import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initAuthListener: () => (() => void) | void; // 👈 update return type
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  initAuthListener: () => {
    if (get().initialized) return; // prevent multiple listeners

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      set({ user: currentUser, loading: false });
    });

    set({ initialized: true });

    return unsubscribe; // 👈 return the unsubscribe callback
  },
}));
