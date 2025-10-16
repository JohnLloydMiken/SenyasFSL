// src/services/levelService.ts

import { getFunctions, httpsCallable } from "firebase/functions";
import {
  GetLevelsData,
  GetLevelsResult,
  CreateLevelData,
  CreateLevelResult,
  UpdateLevelData,
  UpdateLevelResult,
  DeleteLevelData,
  DeleteLevelResult,
  ContentLevel, // Correct type name
} from "@/shared/types";

const functions = getFunctions();

// GET
const getLevelsAdmin = httpsCallable<GetLevelsData, GetLevelsResult>(
  functions, // Pass the 'functions' instance as the first argument
  "getLevelsAsAdmin"
);
export const getLevels = async (sectionId: string): Promise<ContentLevel[]> => {
  const result = await getLevelsAdmin({ sectionId });
  return result.data.levels;
};

// CREATE
const createLevelAdmin = httpsCallable<CreateLevelData, CreateLevelResult>(
  functions, // Pass the 'functions' instance as the first argument
  "createLevelAsAdmin"
);
export const createLevel = async (
  data: CreateLevelData
): Promise<CreateLevelResult> => {
  const result = await createLevelAdmin(data);
  return result.data;
};

// UPDATE
const updateLevelAdmin = httpsCallable<UpdateLevelData, UpdateLevelResult>(
  functions, // Pass the 'functions' instance as the first argument
  "updateLevelAsAdmin"
);
export const updateLevel = async (
  id: string,
  data: Partial<Omit<ContentLevel, "id">> // Corrected to use ContentLevel
): Promise<UpdateLevelResult> => {
  const result = await updateLevelAdmin({ id, data });
  return result.data;
};

// DELETE
const deleteLevelAdmin = httpsCallable<DeleteLevelData, DeleteLevelResult>(
  functions, // Pass the 'functions' instance as the first argument
  "deleteLevelAsAdmin"
);
export const deleteLevel = async (id: string): Promise<DeleteLevelResult> => {
  const result = await deleteLevelAdmin({ id });
  return result.data;
};

export const levelService = {
  get: getLevels,
  create: createLevel,
  update: updateLevel,
  delete: deleteLevel,
};
