// src/services/authService.ts
import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/firebaseConfig";
import {
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
  sendEmailVerification as firebaseSendEmailVerification,
  updatePassword,
  User,
} from "firebase/auth";

export function mapAuthError(error: any): string {
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
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "The password you entered is incorrect. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already registered to another account.";
    case "auth/too-many-requests":
      return "Too many requests. Please wait a few minutes before trying again.";
    case "ACCOUNT_DELETION_FAILED":
      return "There was a problem deleting your account. Please try again later.";
    default:
      if (codeOrMsg.startsWith("Firebase:")) {
        console.error("Unhandled Firebase Error:", codeOrMsg);
        return "An unexpected error occurred. Please try again.";
      }
      return codeOrMsg || "An unknown error occurred.";
  }
}

export async function checkUsername(
  username: string
): Promise<CheckUsernameResult> {
  try {
    const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error(
        "Firebase Project ID is not configured in environment variables."
      );
    }
    const url = `https://us-central1-${projectId}.cloudfunctions.net/checkUsernameAvailability?username=${encodeURIComponent(
      username.trim()
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data as CheckUsernameResult;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function registerUser(
  data: CreateUserAccountData
): Promise<CreateUserAccountResult> {
  try {
    // 1. Call the backend function to create the user entry
    const fn = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
      functions,
      "createUserAccount"
    );
    const res = await fn(data);

    // 2. After success, sign in to the client to get the User object
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (userCredential.user) {
      // 3. Send the verification email
      await sendVerificationEmail(userCredential.user);
    }

    // 4. Sign back out immediately
    await signOut(auth);

    // 5. Return the original success response
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      // This check is already in place and is correct!
      const error: any = new Error("Please verify your email first.");
      error.code = "auth/email-not-verified";
      throw error;
    }
    return userCredential;
  } catch (error: any) {
    const mappedError: any = new Error(mapAuthError(error));
    mappedError.code = error.code || "auth/unknown";
    throw mappedError;
  }
}

export async function sendPasswordResetIfExists(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    let methods: string[] = [];
    try {
      methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
      console.log("Sign-in methods for", normalizedEmail, methods);
    } catch (e) {
      console.warn("fetchSignInMethodsForEmail failed, continuing anyway...");
    }

    await sendPasswordResetEmail(auth, normalizedEmail);

    return "If this email is registered, a reset link has been sent.";
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
      throw new Error("Authentication required. Please log in again.");
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
    const res = await fn(data);
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export async function sendVerificationEmail(user: User | null): Promise<void> {
  try {
    if (!user) {
      throw new Error(
        "No user object provided for sending verification email."
      );
    }
    
    // ✅ Remove the actionCodeSettings object
    //    const actionCodeSettings = {
    //      url: window.location.origin + "/", // 👈 THIS IS THE PROBLEM
    //    };
    //    await firebaseSendEmailVerification(user, actionCodeSettings);
    
    // ✅ Call the function without actionCodeSettings
    await firebaseSendEmailVerification(user);

  } catch (error: any) {
    console.error("Error sending verification email:", error);
    throw new Error(mapAuthError(error));
  }
}

export async function changeUserPassword(newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Authentication required. Please log in again.");
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
    const res = await fn({});
    return res.data;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}
