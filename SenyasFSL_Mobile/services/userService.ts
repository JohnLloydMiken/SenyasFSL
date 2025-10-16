import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import {
  RecordUserActivityData,
  RecordUserActivityResult,
} from "@/shared/types/auth"; // We get the "contract" for our function from the shared types

/**
 * Calls the secure backend function to record that the user has completed
 * a learning activity today, which will update their streak according to our "Golden Mean" logic.
 */
export async function recordActivity(): Promise<RecordUserActivityResult> {
  try {
    // Get a reference to our new 'recordUserActivity' Cloud Function
    const recordUserActivityFunction = httpsCallable<
      RecordUserActivityData,
      RecordUserActivityResult
    >(functions, "recordUserActivity");

    // Call the function. The payload is empty as the user is identified by their auth token.
    const result: HttpsCallableResult<RecordUserActivityResult> =
      await recordUserActivityFunction({});

    // Log the result for easy debugging in the browser console
    console.log("Streak activity recorded:", result.data);

    return result.data;
  } catch (error: any) {
    // If anything goes wrong, log the error and re-throw it so the UI can handle it.
    console.error("Error recording user activity:", error);
    throw new Error("Failed to record activity.");
  }
}
