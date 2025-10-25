// src/store/useUserStore.ts
import { create } from "zustand";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import type { User as AuthUser } from "firebase/auth";
import { UserProfileData } from "shared/types/user";
import { useAuthStore } from "./useAuthStore";
import { markFirestoreVerified } from "@/services/userService";

interface UserStoreState {
  userData: UserProfileData | null;
  loading: boolean;
  unsubscribe: (() => void) | null;
  fetchUserData: (authUser: AuthUser | null) => void;
  clearUserData: () => void;
  // ✅ 1. Add the new function to the interface
  updateUserData: (newData: Partial<UserProfileData>) => void;
}

interface UserReason {
  reason: string;
  setReason: (value: string) => void;
}

export const userReason = create<UserReason>((set) => ({
  reason: "",
  setReason: (value: string) => set({ reason: value }),
}));

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
    verified: false,
    verifiedAt: null,
  };

  return {
    ...defaults,
    ...data,
    // Ensure these timestamps are converted to numbers (milliseconds)
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : null,
    lastActivityDate: data.lastActivityDate instanceof Timestamp ? data.lastActivityDate.toMillis() : null,
    lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toMillis() : null,
    verifiedAt: data.verifiedAt instanceof Timestamp ? data.verifiedAt.toMillis() : null,
    // Ensure these fields are always present
    id: authUser.uid,
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
        const firestoreData = docSnap.data();

        // --- START: ADDED VERIFICATION SYNC LOGIC ---
        // We have both authUser (from Auth) and firestoreData (from DB)
        // Now we can compare them.
        if (authUser.emailVerified && !firestoreData.verified) {
          console.log(
            "Auth is verified but Firestore is not. Syncing now..."
          );
          // Don't wait for this to finish, let it run in the background
          markFirestoreVerified().catch((err) =>
            console.error("Failed to sync verification:", err)
          );
        }
        // --- END: ADDED VERIFICATION SYNC LOGIC ---

        const parsedData = parseUserData(firestoreData, authUser);
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

  // ✅ 2. Add the implementation for the new function
  // This function allows any component to manually update the user's state.
  updateUserData: (newData: Partial<UserProfileData>) => {
    set((state) => ({
      userData: {
        ...(state.userData as UserProfileData), // Keep existing data (like uid, email)
        ...newData, // Overwrite with the new data
      },
    }));
  },
}));