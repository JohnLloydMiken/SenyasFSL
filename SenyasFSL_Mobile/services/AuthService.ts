import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { functions, auth } from "../firebaseConfig";
import {
  CheckUsernameData,
  CheckUsernameResult,
  CreateUserAccountData,
  CreateUserAccountResult,
  UpdateUserProfileData,
  UpdateUserProfileResult,
  DeleteUserAccountData,
  DeleteUserAccountResult,
} from "@/shared/types/auth";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";

// NOTE: The 'cors' imports have been removed as they are not needed on the client-side.

/**
 * Map backend error codes/messages to friendly UI messages.
 */
function mapAuthError(error: any): string {
  const codeOrMsg = error?.message || error?.code || "";
  switch (codeOrMsg) {
    case "auth/weak-password":
      return "Your new password must be at least 6 characters long.";
    case "INVALID_EMAIL":
      return "Please enter a valid email address.";
    case "USERNAME_TAKEN":
      return "This username is already taken.";
    case "EMAIL_IN_USE":
      return "This email is already registered to another account.";
    case "WEAK_PASSWORD":
      return "Password must be at least 6 characters long.";
    case "INVALID_USERNAME":
      return "Username must be 3–20 characters, lowercase letters, numbers, underscores, or hyphens.";
    case "No account with this email":
      return "No account with this email.";
    case "auth/wrong-password":
      return "The password you entered is incorrect. Please try again.";
    case "ACCOUNT_DELETION_FAILED":
      return "There was a problem deleting your account. Please try again later.";
    default:
      return codeOrMsg || "An unknown error occurred.";
  }
}

// --- THIS IS THE UPDATED FUNCTION ---
export async function checkUsername(
  username: string
): Promise<CheckUsernameResult> {
  try {
    // Construct the URL to your public HTTP function
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const url = `https://us-central1-${projectId}.cloudfunctions.net/checkUsernameAvailability?username=${encodeURIComponent(
      username
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to check username.");
    }

    return data as CheckUsernameResult;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}
// --- END OF UPDATED FUNCTION ---

export async function registerUser(
  data: CreateUserAccountData
): Promise<CreateUserAccountResult> {
  try {
    // This is the correct method for this function
    const fn = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
      functions,
      "createUserAccount"
    );
    const res: HttpsCallableResult<CreateUserAccountResult> = await fn(data);
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function loginUser(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function sendPasswordResetIfExists(email: string) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      throw new Error("No account with this email");
    }
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Could not log out. Please try again.");
  }
}

export async function reauthenticateUser(password: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user is currently signed in.");
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function updateUserProfile(
  data: UpdateUserProfileData
): Promise<UpdateUserProfileResult> {
  try {
    const fn = httpsCallable<UpdateUserProfileData, UpdateUserProfileResult>(
      functions,
      "updateUserProfile"
    );
    const res: HttpsCallableResult<UpdateUserProfileResult> = await fn(data);
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function sendVerificationEmail(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is signed in to send a verification email.");
    }
    const actionCodeSettings = {
      // NOTE: You may want to change this URL to your production URL when you deploy
      url: "http://localhost:5173/",
    };
    await sendEmailVerification(user, actionCodeSettings);
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    throw new Error(
      "Could not send verification email. Please try again later."
    );
  }
}

export async function changeUserPassword(newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
    await updatePassword(user, newPassword);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function deleteUserAccount(): Promise<DeleteUserAccountResult> {
  try {
    const fn = httpsCallable<DeleteUserAccountData, DeleteUserAccountResult>(
      functions,
      "deleteUserAccount"
    );
    const res: HttpsCallableResult<DeleteUserAccountResult> = await fn({});
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}