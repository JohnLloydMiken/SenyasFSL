// FILE: src/services/sectionService.ts

import { getFunctions, httpsCallable } from "firebase/functions";
import {
  GetSectionsResult,
  CreateSectionData,
  CreateSectionResult,
  UpdateSectionData,
  UpdateSectionResult,
  DeleteSectionData,
  DeleteSectionResult,
  ContentSection,
} from "@/shared/types";

const functions = getFunctions();

// --------------------
// READ
// --------------------
const getSectionsAdmin = httpsCallable<void, GetSectionsResult>(
  functions,
  "getSectionsAsAdmin"
);

export const getSections = async (): Promise<ContentSection[]> => {
  const result = await getSectionsAdmin();
  return result.data.sections;
};

// --------------------
// CREATE
// --------------------
const createSectionAdmin = httpsCallable<
  CreateSectionData,
  CreateSectionResult
>(functions, "createSectionAsAdmin");

export const createSection = async (
  data: CreateSectionData
): Promise<CreateSectionResult> => {
  const result = await createSectionAdmin(data);
  return result.data;
};

// --------------------
// UPDATE
// --------------------
const updateSectionAdmin = httpsCallable<
  UpdateSectionData,
  UpdateSectionResult
>(functions, "updateSectionAsAdmin");

export const updateSection = async (
  id: string,
  data: Partial<Omit<ContentSection, "id">>
): Promise<UpdateSectionResult> => {
  const result = await updateSectionAdmin({ id, data });
  return result.data;
};

// --------------------
// DELETE
// --------------------
const deleteSectionAdmin = httpsCallable<
  DeleteSectionData,
  DeleteSectionResult
>(functions, "deleteSectionAsAdmin");

export const deleteSection = async (
  id: string
): Promise<DeleteSectionResult> => {
  const result = await deleteSectionAdmin({ id });
  return result.data;
};

// Consolidate into a single service object
export const sectionService = {
  get: getSections,
  create: createSection,
  update: updateSection,
  delete: deleteSection,
};
