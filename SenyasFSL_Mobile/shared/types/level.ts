// packages/shared/src/types/level.ts

// ... (other type definitions like FlowStep and LevelIntroduction)
export interface FlowStep {
  ref: string;
  step: number;
  type: "lesson" | "question";
}

export interface LevelIntroduction {
  instructionsEn: string[];
  instructionsFil: string[];
  reminder: string;
  subtitle: string;
  title: string;
}

export type LevelType =
  | "lesson_and_minigame"
  | "practice_recognition"
  | "quiz_survival";

/**
 * Base interface with fields common to ALL level types.
 * 👇 RENAMED HERE
 */
interface ContentLevelBase {
  id: string;
  name: string;
  order: number;
  sectionId: string;
  type: LevelType;
  introduction: LevelIntroduction;
}

/**
 * Structure for levels 1 & 3.
 * 👇 RENAMED HERE
 */
export interface ContentLevelLessonAndMinigame extends ContentLevelBase {
  type: "lesson_and_minigame";
  flow: FlowStep[];
}

/**
 * Structure for levels 2, 4, & 5.
 * 👇 RENAMED HERE
 */
export interface ContentLevelQuiz extends ContentLevelBase {
  type: "practice_recognition" | "quiz_survival";
  questionPool: string[];
}

/**
 * A union type representing any possible level document.
 * 👇 RENAMED HERE
 */
export type ContentLevel = ContentLevelLessonAndMinigame | ContentLevelQuiz;

// --- API Request and Result Types for Admin Level Management ---

// GET (Read All for a Section)
export type GetLevelsData = {
  sectionId: string;
};
export type GetLevelsResult = {
  levels: ContentLevel[]; // <-- Use new name
};

// CREATE
export type CreateLevelData = Omit<ContentLevel, "id">; // <-- Use new name
export type CreateLevelResult = {
  status: "success";
  id: string;
};

// UPDATE
export type UpdateLevelData = {
  id: string;
  data: Partial<Omit<ContentLevel, "id">>; // <-- Use new name
};
export type UpdateLevelResult = {
  status: "success";
};

// DELETE
export type DeleteLevelData = {
  id: string;
};
export type DeleteLevelResult = {
  status: "success";
};
