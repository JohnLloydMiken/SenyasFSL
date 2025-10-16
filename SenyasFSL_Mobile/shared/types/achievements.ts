// packages/shared/src/types/achievements.ts

// The shape of the unlock condition object
export interface AchievementUnlockCondition {
  type: "streak" | "progressCount";
  value: number;
}

// Renamed from AchievementData for consistency
export interface ContentAchievement {
  id: string; // Document ID
  title: string;
  description: string;
  type: "award" | "other";
  category: string;
  image: string; // gs:// URL
  detailImage: string; // gs:// URL
  rewardCoins: number;
  unlockCondition: AchievementUnlockCondition;
}

// --- USER-FACING TYPES (Existing) ---
export interface CheckAchievementsData {}
export interface CheckAchievementsResult {
  newlyUnlocked: ContentAchievement[];
}

// --- ADMIN CRUD API TYPES (New) ---

// GET
export type GetAchievementsResult = {
  achievements: ContentAchievement[];
};

// CREATE
export type CreateAchievementData = ContentAchievement;
export type CreateAchievementResult = {
  status: "success";
  id: string;
};

// UPDATE
export type UpdateAchievementData = {
  id: string;
  data: Partial<Omit<ContentAchievement, "id">>;
};
export type UpdateAchievementResult = {
  status: "success";
};

// DELETE
export type DeleteAchievementData = {
  id: string;
};
export type DeleteAchievementResult = {
  status: "success";
};
