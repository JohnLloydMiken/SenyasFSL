// shared/types/auth.ts

// Payload and result for checking username availability
export interface CheckUsernameData {
  username: string;
}
export interface CheckUsernameResult {
  isAvailable: boolean;
}

// Payload and result for creating a user account
export interface CreateUserAccountData {
  email: string;
  password: string;
  username: string;
  usernameLower?: string; // optional, backend will normalize if not provided
  reason: string;
}
export interface CreateUserAccountResult {
  status: "success";
  uid: string;
  code?: string; // optional machine-readable code for frontend mapping
}
// Payload and result for updating a user's profile
export interface UpdateUserProfileData {
  newUsername?: string;
  newEmail?: string;
}
export interface UpdateUserProfileResult {
  status: "success";
  message: string;
}

// --- START OF NEW CODE ---
// Payload and result for recording user activity and updating their streak.
// The payload is empty because the function gets the user's ID from their auth token.
export interface RecordUserActivityData {}
export interface RecordUserActivityResult {
  status:
    | "success"
    | "already_recorded_today"
    | "streak_lost"
    | "streak_maintained"
    | "streak_protected"; // 👈 Add this new status
  newStreak: number;
}
// --- END OF NEW CODE ---
export interface DeleteUserAccountData {}
export interface DeleteUserAccountResult {
  status: "success";
  message: string;
}
// A single leaderboard entry
export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
};

// All leaderboard tabs
export type LeaderboardData = {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
};

// Keys for tabs
export type TabKey = keyof LeaderboardData;

// Info about the logged-in/current user
export type CurrentUserInfo = {
  id: string;
  name: string;
  rank: number;
  points: number;
  percentile: number;
};