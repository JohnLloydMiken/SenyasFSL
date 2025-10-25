import { httpsCallable, HttpsCallableResult } from "firebase/functions";
// 👇 1. ADD 'db' TO YOUR FIRESTORE IMPORTS
import { functions, db } from "@/firebaseConfig";
// 👇 2. ADD 'doc' AND 'getDoc'
import { doc, getDoc } from "firebase/firestore";
import {
  RecordUserActivityData,
  RecordUserActivityResult,
} from "@/shared/types/auth";
// 👇 3. IMPORT YOUR SHARED 'UserProfile' TYPE
import { UserProfileData } from "@/shared/types/user";

// --- START: NEW FUNCTION ---
/**
 * Calls the 'markUserVerified' backend function to set
 * `verified: true` in the user's Firestore document.
 */
// Get a reference to the cloud function
const markUserVerifiedFunction = httpsCallable(functions, "markUserVerified");

export async function markFirestoreVerified(): Promise<void> {
  try {
    console.log("Calling markUserVerified Cloud Function...");
    // Call the function. No payload is needed.
    await markUserVerifiedFunction({});
    console.log("Firestore successfully marked as verified.");
  } catch (error: any) {
    console.error("Error marking user as verified in Firestore:", error);
    throw new Error("Failed to sync verification status.");
  }
}
// --- END: NEW FUNCTION ---

// --- START: NEW FUNCTION ---
/**
 * Fetches a user's document from the 'users' collection in Firestore.
 */
export async function fetchUserProfile(
  uid: string
): Promise<UserProfileData | null> {
  if (!uid) {
    console.log("fetchUserProfile: No UID provided");
    return null;
  }
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Return the user data, cast to UserProfile
      return userDocSnap.data() as UserProfileData;
    } else {
      console.warn("No user document found for UID:", uid);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile.");
  }
}
// --- END: NEW FUNCTION ---

/**
 * Calls the secure backend function to record that the user has completed
 * a learning activity today, which will update their streak.
 */
export async function recordActivity(): Promise<RecordUserActivityResult> {
  try {
    const recordUserActivityFunction = httpsCallable<
      RecordUserActivityData,
      RecordUserActivityResult
    >(functions, "recordUserActivity");

    const result: HttpsCallableResult<RecordUserActivityResult> =
      await recordUserActivityFunction({});

    console.log("Streak activity recorded:", result.data);

    return result.data;
  } catch (error: any) {
    console.error("Error recording user activity:", error);
    throw new Error("Failed to record activity.");
  }
}