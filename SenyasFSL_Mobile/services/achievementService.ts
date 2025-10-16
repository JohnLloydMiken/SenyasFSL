// src/services/achievementService.ts
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/firebaseConfig";
import {
  ContentAchievement,
  CheckAchievementsData,
  CheckAchievementsResult,
  GetAchievementsResult,
  CreateAchievementData,
  CreateAchievementResult,
  UpdateAchievementData,
  UpdateAchievementResult,
  DeleteAchievementData,
  DeleteAchievementResult,
} from "@/shared/types";

// =====================================================================
// USER-FACING FUNCTIONS (For your client app)
// =====================================================================

/**
 * Fetches the master list of all possible achievements from Firestore.
 * This is the function your AchievementsModal.tsx is looking for.
 */
export const getAllAchievements = async (): Promise<ContentAchievement[]> => {
  try {
    const achievementsCollection = collection(db, "achievements");
    const q = query(achievementsCollection, orderBy("title"));
    const querySnapshot = await getDocs(q);

    const achievements = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContentAchievement[];

    return achievements;
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    throw new Error("Failed to fetch achievements master list.");
  }
};

/**
 * Calls the secure backend function to check for and grant any new achievements.
 */
export const checkAchievements = async (): Promise<CheckAchievementsResult> => {
  try {
    const checkAchievementsFunction = httpsCallable<
      CheckAchievementsData,
      CheckAchievementsResult
    >(functions, "checkAndGrantAchievements");

    const result = await checkAchievementsFunction({});
    return result.data;
  } catch (error) {
    console.error("Error checking for new achievements:", error);
    throw new Error("Failed to check for achievements.");
  }
};

// =====================================================================
// ADMIN-FACING SERVICE (For your admin dashboard)
// =====================================================================

const getAchievementsAdmin = httpsCallable<void, GetAchievementsResult>(
  functions,
  "getAchievementsAsAdmin"
);
const createAchievementAdmin = httpsCallable<
  CreateAchievementData,
  CreateAchievementResult
>(functions, "createAchievementAsAdmin");
const updateAchievementAdmin = httpsCallable<
  UpdateAchievementData,
  UpdateAchievementResult
>(functions, "updateAchievementAsAdmin");
const deleteAchievementAdmin = httpsCallable<
  DeleteAchievementData,
  DeleteAchievementResult
>(functions, "deleteAchievementAsAdmin");

export const adminAchievementService = {
  get: async (): Promise<ContentAchievement[]> => {
    const result = await getAchievementsAdmin();
    return result.data.achievements;
  },
  create: async (
    data: CreateAchievementData
  ): Promise<CreateAchievementResult> => {
    const result = await createAchievementAdmin(data);
    return result.data;
  },
  update: async (
    id: string,
    data: Partial<Omit<ContentAchievement, "id">>
  ): Promise<UpdateAchievementResult> => {
    const result = await updateAchievementAdmin({ id, data });
    return result.data;
  },
  delete: async (id: string): Promise<DeleteAchievementResult> => {
    const result = await deleteAchievementAdmin({ id });
    return result.data;
  },
};
