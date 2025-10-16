// src/services/adminService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import {
  // Import the new paginated types
  GetPaginatedUsersData,
  GetPaginatedUsersResult,
  DeleteUserData,
  DeleteUserResult,
  CreateUserData,
  CreateUserResult,
  UpdateUserData,
  UpdateUserResult,
} from "shared/types/admin";
import toast from "react-hot-toast";

/**
 * 🧩 Fetches a paginated, sorted, and searchable list of users (Admin only)
 * This is the new function for the Leaderboard page.
 */
export const getPaginatedUsers = async (
  options: GetPaginatedUsersData
): Promise<GetPaginatedUsersResult> => {
  try {
    const getUsersFunction = httpsCallable<
      GetPaginatedUsersData,
      GetPaginatedUsersResult
    >(functions, "getUsersAsAdmin");

    // Pass the options (page, sortBy, etc.) to the cloud function
    const result = await getUsersFunction(options);
    return result.data;
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    toast.error("Could not fetch user list.");
    throw error;
  }
};

/**
 * ➕ Creates a new user (Admin only)
 * (This function remains unchanged)
 */
export const createUser = async (
  data: CreateUserData
): Promise<CreateUserResult> => {
  try {
    const createUserFunction = httpsCallable<CreateUserData, CreateUserResult>(
      functions,
      "createUserAsAdmin"
    );
    const result = await toast.promise(createUserFunction(data), {
      loading: "Creating user...",
      success: "✅ User created successfully!",
      error: "❌ Failed to create user.",
    });
    return result.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * 🧭 Updates user data (Admin only)
 * (This function remains unchanged)
 */
export const updateUser = async (
  data: UpdateUserData
): Promise<UpdateUserResult> => {
  try {
    const updateUserFunction = httpsCallable<UpdateUserData, UpdateUserResult>(
      functions,
      "updateUserAsAdmin"
    );

    const result = await toast.promise(updateUserFunction(data), {
      loading: "Updating user...",
      success: "✅ User updated successfully!",
      error: "❌ Failed to update user.",
    });

    return result.data;
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (
      error.message?.includes("already-exists") ||
      error.code === "functions/already-exists"
    ) {
      toast.error("⚠️ That username is already taken by another user.");
    } else if (error.message?.includes("permission-denied")) {
      toast.error("🚫 You don’t have permission to update this user.");
    } else {
      toast.error("❌ Something went wrong while updating the user.");
    }

    throw error;
  }
};

/**
 * 🗑 Deletes a user (Admin only)
 * (This function remains unchanged)
 */
export const deleteUser = async (
  uidToDelete: string
): Promise<DeleteUserResult> => {
  try {
    const deleteUserFunction = httpsCallable<DeleteUserData, DeleteUserResult>(
      functions,
      "deleteUserAsAdmin"
    );

    const result = await toast.promise(deleteUserFunction({ uidToDelete }), {
      loading: "Deleting user...",
      success: "🗑 User successfully deleted.",
      error: "❌ Failed to delete user.",
    });

    return result.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
