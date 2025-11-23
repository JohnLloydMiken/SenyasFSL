// src/store/useAuthStore.ts
import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
// 👇 1. IMPORT YOUR USER SERVICE FUNCTIONS
import {
  fetchUserProfile,
  markFirestoreVerified,
} from "@/services/userService"; // Make sure userService.ts has these

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initAuthListener: () => (() => void) | void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  initAuthListener: () => {
    if (get().initialized) return; // prevent multiple listeners

    // 👇 2. MAKE THE CALLBACK "ASYNC"
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // --- START: ADDED VERIFICATION LOGIC ---
      if (currentUser) {
        // Check if the user is verified in Firebase Auth
        if (currentUser.emailVerified) {
          try {
            // Get the user's document from Firestore
            const firestoreUser = await fetchUserProfile(currentUser.uid);

            // If the Firestore document exists AND is NOT marked as verified
            if (firestoreUser && !firestoreUser.verified) {
              console.log(
                "Auth is verified but Firestore is not. Syncing..."
              );
              // Call the cloud function to update Firestore
              await markFirestoreVerified();
            }
          } catch (error) {
            console.error(
              "Error during verification sync in useAuthStore:",
              error
            );
          }
        }
      }
      // --- END: ADDED VERIFICATION LOGIC ---

      // This original line runs after the check, setting the user (or null)
      set({ user: currentUser, loading: false });
    });

    set({ initialized: true });

    return unsubscribe; // 👈 return the unsubscribe callback
  },
}));
const OFFLINE_USER_KEY = '@app_offline_user';
const saveOfflineUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(OFFLINE_USER_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      // add other needed fields
    }));
  } catch (error) {
    console.error('Failed to save offline user:', error);
  }
};

// Load user data from local storage
const loadOfflineUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(OFFLINE_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to load offline user:', error);
    return null;
  }
};

// Clear offline user on logout
const clearOfflineUser = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_USER_KEY);
  } catch (error) {
    console.error('Failed to clear offline user:', error);
  }
};