// src/store/useUserStore.ts
import { create } from "zustand";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import type { User as AuthUser } from "firebase/auth";
import { UserProfileData } from "shared/types/user";
import { useAuthStore } from "./useAuthStore";

interface UserStoreState {
  userData: UserProfileData | null;
  loading: boolean;
  unsubscribe: (() => void) | null;
  fetchUserData: (authUser: AuthUser | null) => void;
  clearUserData: () => void;
}

interface UserReason{
  reason: string;
  setReason: (value: string)=>void;

}

export const userReason = create<UserReason>((set)=>({
    reason: "",
  setReason: (value: string) => set({ reason: value }),
}))

const parseUserData = (data: any, authUser: AuthUser): UserProfileData => {
  const defaults = {
    username: "New User",
    currentStreak: 0,
    streakFreezes: 0,
    xp: 0,
    senyasCoins: 0,
    activityDays: [],
    progress: {},
    inventory: {
      xpMultiply: 0,
      bomb: 0,
      skip: 0,
      twotry: 0,
      streakProtect: 0,
    },
    chestCount: 0,
    achievements: [],
    lastUpdated: Timestamp.now(),
  };

  return {
    ...defaults,
    ...data,
    uid: authUser.uid,
    email: authUser.email || "",
  };
};

export const useUserStore = create<UserStoreState>((set, get) => ({
  userData: null,
  loading: true,
  unsubscribe: null,

  fetchUserData: (authUser) => {
    // Clean up previous listener if exists
    const prevUnsub = get().unsubscribe;
    if (prevUnsub) prevUnsub();

    if (!authUser) {
      set({ userData: null, loading: false });
      return;
    }

    set({ loading: true });

    const userDocRef = doc(db, "users", authUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const parsedData = parseUserData(docSnap.data(), authUser);
        set({ userData: parsedData });
      } else {
        console.warn("User document not found!");
        set({ userData: null });
      }
      set({ loading: false });
    });

    set({ unsubscribe });
  },

  clearUserData: () => {
    const prevUnsub = get().unsubscribe;
    if (prevUnsub) prevUnsub();
    set({ userData: null, loading: false, unsubscribe: null });
  },
}));
