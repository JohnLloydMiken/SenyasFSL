import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId,
  Firestore,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { db, storage, functions } from "@/firebaseConfig";
import { Level, LevelFlowStep, Section } from "shared/types/game";
import { Lesson, Question } from "shared/types/content";
import { CompleteLevelData, CompleteLevelResult } from "shared/types/user";
import Toast from "react-native-toast-message";
/**
 * Fetches a single level's complete data structure from Firestore.
 */
export const getLevelData = async (levelId: string): Promise<Level | null> => {
  try {
    const levelDocRef = doc(db as Firestore, "levels", levelId);
    const docSnap = await getDoc(levelDocRef);
    if (!docSnap.exists()) {
      console.warn(`Level with ID "${levelId}" not found.`);
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Level;
  } catch (error) {
    console.error("Error fetching level data:", error);
    throw new Error("Failed to fetch level data.");
  }
};

/**
 * Fetches all the lesson and question documents required for a given level's flow.
 */
export const getFlowContent = async (
  flow: LevelFlowStep[]
): Promise<Map<string, Lesson | Question>> => {
  const contentMap = new Map<string, Lesson | Question>();
  if (flow.length === 0) return contentMap;

  const lessonIds = flow
    .filter((step) => step.type === "lesson")
    .map((step) => step.ref);
  const questionIds = flow
    .filter((step) => step.type === "question")
    .map((step) => step.ref);

  try {
    if (lessonIds.length > 0) {
      const lessonsQuery = query(
        collection(db as Firestore, "lessons"),
        where(documentId(), "in", lessonIds)
      );
      const lessonSnapshots = await getDocs(lessonsQuery);
      lessonSnapshots.forEach((doc) => {
        contentMap.set(doc.id, { id: doc.id, ...doc.data() } as Lesson);
      });
    }

    if (questionIds.length > 0) {
      const questionsQuery = query(
        collection(db as Firestore, "questions"),
        where(documentId(), "in", questionIds)
      );
      const questionSnapshots = await getDocs(questionsQuery);
      questionSnapshots.forEach((doc) => {
        contentMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
      });
    }

    return contentMap;
  } catch (error) {
    console.error("Error fetching flow content:", error);
    throw new Error("Failed to fetch content for the level.");
  }
};

export const getQuestionsFromPool = async (
  questionIds: string[]
): Promise<Map<string, Question>> => {
  const contentMap = new Map<string, Question>();
  if (!questionIds || questionIds.length === 0) {
    return contentMap;
  }

  try {
    // Firestore 'in' queries are limited to 30 items.
    // If you expect more, you'll need to batch the requests.
    // This implementation assumes fewer than 30 questions per level.
    const questionsQuery = query(
      collection(db as Firestore, "questions"),
      where(documentId(), "in", questionIds)
    );
    const questionSnapshots = await getDocs(questionsQuery);
    questionSnapshots.forEach((doc) => {
      contentMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
    });

    return contentMap;
  } catch (error) {
    console.error("Error fetching questions from pool:", error);
    throw new Error("Failed to fetch questions for the level.");
  }
};

/**
 * Converts a Firebase Storage gs:// path to a public, downloadable HTTPS URL.
 */
export const getVideoUrl = async (gsPath: string): Promise<string> => {
  try {
    const fileRef = ref(storage, gsPath);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting video download URL:", error);
    throw new Error("Could not get video URL.");
  }
};

/**
 * Fetches all section documents to build the learning map.
 * @returns A promise that resolves to an array of section data.
 */
export const getSectionsData = async (): Promise<Section[]> => {
  try {
    const sectionsCollection = collection(db as Firestore, "sections");
    const q = query(sectionsCollection, orderBy("order")); // Order sections by the 'order' field
    const querySnapshot = await getDocs(q);

    const sections = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Section[];

    return sections;
  } catch (error) {
    console.error("Error fetching sections data:", error);
    throw new Error("Failed to fetch sections data.");
  }
};

/* ------------------------------------------------------------------
   NEW GAME ECONOMY FUNCTIONS (via callable Cloud Functions)
-------------------------------------------------------------------*/

/**
 * Buys an item: calls the secure backend function to deduct coins and increment inventory.
 */
export const buyItem = async (
  itemId: string,
  price: number
): Promise<boolean> => {
  const fn = httpsCallable(functions, "buyItem");

  // ✅ 2. Show a loading toast and wait for the promise
  Toast.show({
    type: "info", // You can customize this
    text1: "Purchasing item...",
    visibilityTime: 2000,
  });

  try {
    await fn({ itemId, price });

    // ✅ 3. Show success toast (the component will show its own)
    // We just return true here, the component will handle the success message.
    return true;
  } catch (error: any) {
    // ✅ 4. Show a specific error toast from the backend
    console.error("Error buying item:", error);
    Toast.show({
      type: "error",
      text1: "Purchase Failed",
      text2: error.message || "An unknown error occurred.",
    });
    return false;
  }
};

/**
 * Opens a chest: calls the secure backend function to decrement chestCount and increment prize item.
 */
export const openChest = async (prizeId: string): Promise<void> => {
  const fn = httpsCallable(functions, "openChest");
  await fn({ prizeId });
};

export const saveLevelProgress = async (
  data: CompleteLevelData
): Promise<CompleteLevelResult> => {
  try {
    const fn = httpsCallable<CompleteLevelData, CompleteLevelResult>(
      functions,
      "completeLevel"
    );
    const result: HttpsCallableResult<CompleteLevelResult> = await fn(data);

    console.log("Progress saved successfully. New totals:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error saving level progress:", error);
    // Re-throw the error so the UI can handle it if needed
    throw new Error("Failed to save your progress. Please try again.");
  }
};

export const useItem = async (itemId: string): Promise<{ status: string }> => {
  try {
    const useItemFunction = httpsCallable<
      { itemId: string },
      { status: string }
    >(functions, "useItem");
    console.log(`Calling 'useItem' cloud function for item: ${itemId}`);
    const result = await useItemFunction({ itemId });
    return result.data;
  } catch (error) {
    console.error(`Error using item ${itemId} via cloud function:`, error);
    // Re-throw the error so the UI can handle it (e.g., show a notification)
    throw error;
  }
};
