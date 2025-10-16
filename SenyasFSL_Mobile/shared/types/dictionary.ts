// packages/shared/src/types/dictionary.ts

// This defines the structure of a single lesson object inside the 'items' array
export interface DictionaryLesson {
  id: string;
  enLabel: string;
  filLabel: string;
  video: string; // gs:// URL
}

// This defines the structure of a full category document
export interface DictionaryCategory {
  id: string; // Document ID, e.g., "ordinal"
  label: string;
  subtext: string;
  icon: string;
  items: DictionaryLesson[];
}

// --- ADMIN CRUD API TYPES (New) ---

// GET
export type GetDictionaryCategoriesResult = {
  categories: DictionaryCategory[];
};

// CREATE
export type CreateDictionaryCategoryData = DictionaryCategory;
export type CreateDictionaryCategoryResult = {
  status: "success";
  id: string;
};

// UPDATE
export type UpdateDictionaryCategoryData = {
  id: string;
  data: Partial<Omit<DictionaryCategory, "id">>;
};
export type UpdateDictionaryCategoryResult = {
  status: "success";
};

// DELETE
export type DeleteDictionaryCategoryData = {
  id: string;
};
export type DeleteDictionaryCategoryResult = {
  status: "success";
};
