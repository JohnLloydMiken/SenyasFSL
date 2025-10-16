// FILE: packages/shared/src/types/section.ts

/**
 * Represents a single position point for a level icon on the section map.
 */
export interface SectionPosition {
  left: string;
  top: string;
}

/**
 * Represents the main structure of a Section document in Firestore.
 * Renamed to ContentSection to avoid naming conflicts.
 */
export interface ContentSection {
  id: string; // Document ID from Firestore
  name: string;
  description: string;
  order: number;
  mascot: string;
  headerIcon: string;
  headerIconClass: string;
  levels: number[];
  positions: SectionPosition[];
}

// --- API Request and Result Types for Admin Section Management ---

/**
 * Result type for the `getSectionsAsAdmin` callable function.
 */
export type GetSectionsResult = {
  sections: ContentSection[];
};

/**
 * Data required for the `createSectionAsAdmin` callable function.
 * We omit 'id' because Firestore will generate it.
 */
export type CreateSectionData = Omit<ContentSection, "id">;

/**
 * Result type for the `createSectionAsAdmin` callable function.
 */
export type CreateSectionResult = {
  status: "success";
  id: string; // The ID of the newly created section document
};

/**
 * Data required for the `updateSectionAsAdmin` callable function.
 */
export type UpdateSectionData = {
  id: string; // The ID of the section to update
  data: Partial<Omit<ContentSection, "id">>; // The fields to update
};

/**
 * Result type for the `updateSectionAsAdmin` callable function.
 */
export type UpdateSectionResult = {
  status: "success";
};

/**
 * Data required for the `deleteSectionAsAdmin` callable function.
 */
export type DeleteSectionData = {
  id: string; // The ID of the section to delete
};

/**
 * Result type for the `deleteSectionAsAdmin` callable function.
 */
export type DeleteSectionResult = {
  status: "success";
};
