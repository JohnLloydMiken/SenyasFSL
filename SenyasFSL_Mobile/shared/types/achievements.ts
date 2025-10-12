// 1. First, define the shape of the unlock condition object
export interface AchievementUnlockCondition {
  type: "streak" | "progressCount"; // Can be expanded with more types later
  value: number;
}

// 2. Then, update the main AchievementData interface
export interface AchievementData {
  id: string;
  title: string;
  description: string;
  type: "award" | "other";
  category: string;
  image: string;
  detailImage: string;
  rewardCoins: number;
  unlockCondition: AchievementUnlockCondition; // 👈 Use the new, specific type
}

// The payload for our function (remains empty)
export interface CheckAchievementsData {}

// The result our function will send back (remains the same)
export interface CheckAchievementsResult {
  newlyUnlocked: AchievementData[];
}