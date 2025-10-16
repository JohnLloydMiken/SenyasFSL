// shared/types/admin.ts
import { UserProfileData } from "./user";

// -------------------------------
// GET USERS (PAGINATED FOR ADMIN LEADERBOARD)
// -------------------------------
// This is the new input type for our enhanced function
export interface GetPaginatedUsersData {
  page: number;
  pageSize: number;
  sortBy: "xp" | "senyasCoins" | "currentStreak" | "createdAt";
  sortDirection: "asc" | "desc";
  searchQuery: string;
}

// This is the new result type, which includes the total count for pagination
export interface GetPaginatedUsersResult {
  users: UserProfileData[];
  totalCount: number;
}

// Keep old names for compatibility, but point them to the new types
export type GetUsersData = GetPaginatedUsersData;
export type GetUsersResult = GetPaginatedUsersResult;

// -------------------------------
// DELETE USER (No changes needed)
// -------------------------------
export interface DeleteUserData {
  uidToDelete: string;
}

export interface DeleteUserResult {
  status: "success";
}

// -------------------------------
// CREATE USER (Admin-Only - No changes needed)
// -------------------------------
export interface CreateUserData {
  email: string;
  password: string;
  username: string;
  reason: string;
}

export interface CreateUserResult {
  status: "success";
  uid: string;
}

// -------------------------------
// UPDATE USER (Admin-Only - No changes needed)
// -------------------------------
export type UserUpdateData = Partial<
  Omit<UserProfileData, "uid" | "email" | "createdAt">
>;

export interface UpdateUserData {
  uidToUpdate: string;
  data: UserUpdateData;
}

export interface UpdateUserResult {
  status: "success";
}
