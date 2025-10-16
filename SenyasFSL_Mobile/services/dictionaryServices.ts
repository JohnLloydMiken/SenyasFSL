// src/services/dictionaryService.ts

import {
  collection,
  getDocs,
  query,
  orderBy,
  Firestore,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions"; // Add httpsCallable import
import { db, functions } from "@/firebaseConfig"; // Add functions import
import {
  DictionaryCategory,
  // Add new admin types
  GetDictionaryCategoriesResult,
  CreateDictionaryCategoryData,
  CreateDictionaryCategoryResult,
  UpdateDictionaryCategoryData,
  UpdateDictionaryCategoryResult,
  DeleteDictionaryCategoryData,
  DeleteDictionaryCategoryResult,
} from "@/shared/types";

/**
 * Fetches all dictionary categories from Firestore and orders them by their label.
 * @returns A promise that resolves to an array of dictionary categories.
 */
export const getDictionaryCategories = async (): Promise<
  DictionaryCategory[]
> => {
  try {
    const categoriesCollection = collection(
      db as Firestore,
      "dictionaryCategories"
    );
    const q = query(categoriesCollection, orderBy("label"));
    const querySnapshot = await getDocs(q);

    const categories = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as DictionaryCategory;
    });

    return categories;
  } catch (error) {
    console.error("Error fetching dictionary categories:", error);
    throw new Error("Failed to fetch dictionary categories.");
  }
};
// --- ADMIN-FACING SERVICE (New) ---
const getDictAdmin = httpsCallable<void, GetDictionaryCategoriesResult>(
  functions,
  "getDictionaryCategoriesAsAdmin"
);
const createDictAdmin = httpsCallable<
  CreateDictionaryCategoryData,
  CreateDictionaryCategoryResult
>(functions, "createDictionaryCategoryAsAdmin");
const updateDictAdmin = httpsCallable<
  UpdateDictionaryCategoryData,
  UpdateDictionaryCategoryResult
>(functions, "updateDictionaryCategoryAsAdmin");
const deleteDictAdmin = httpsCallable<
  DeleteDictionaryCategoryData,
  DeleteDictionaryCategoryResult
>(functions, "deleteDictionaryCategoryAsAdmin");

export const adminDictionaryService = {
  get: async (): Promise<DictionaryCategory[]> => {
    const result = await getDictAdmin();
    return result.data.categories;
  },
  create: async (
    data: CreateDictionaryCategoryData
  ): Promise<CreateDictionaryCategoryResult> => {
    return (await createDictAdmin(data)).data;
  },
  update: async (
    id: string,
    data: Partial<Omit<DictionaryCategory, "id">>
  ): Promise<UpdateDictionaryCategoryResult> => {
    return (await updateDictAdmin({ id, data })).data;
  },
  delete: async (id: string): Promise<DeleteDictionaryCategoryResult> => {
    return (await deleteDictAdmin({ id })).data;
  },
};
// The getVideoUrl function has been moved to gameService.ts
