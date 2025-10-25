// 1. Defines the shape of the user's inventory
export interface Inventory {
  xpMultiply: number;
  bomb: number;
  skip: number;
  twotry: number;
  streakProtect: number;
}

// 2. Creates a specific type that can only be one of the keys from the Inventory
export type ItemId = keyof Inventory;

// 3. This is the main, single source of truth for the user's profile data
export interface UserProfileData {
  id: string;
  uid: string;
  username: string;
  email: string;
  reason?: string;
  currentStreak: number;
  streakFreezes: number;
  xp: number;
  senyasCoins: number;
  activityDays: number[];
  progress: { [key: string]: number };
  inventory: Inventory;
  chestCount: number;
  achievements: string[];
  createdAt: number | null;
  lastActivityDate: number | null;
  lastUpdated: number | null;

  // --- ADD THESE TWO LINES ---
  verified: boolean; // This field comes from your database
  verifiedAt: number | null; // This field also comes from your database
}

// --- Existing Interfaces ---

export interface CompleteLevelData {
  levelId: string;
  xpGained: number;
  senyasCoinsGained: number;
  chestsEarned: number;
}

export interface CompleteLevelResult {
  status: "success";
  newXp: number;
  newSenyasCoins: number;
  newChestCount: number;
  newStreak: number;
}
