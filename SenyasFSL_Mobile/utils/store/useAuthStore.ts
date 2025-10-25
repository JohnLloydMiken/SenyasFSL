// src/store/useAuthStore.ts
import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";
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