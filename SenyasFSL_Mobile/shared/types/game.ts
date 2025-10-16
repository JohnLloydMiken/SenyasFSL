// shared/types/game.ts

/** Represents a single step in a level's flow array. */
export interface LevelFlowStep {
  step: number;
  type: "lesson" | "question";
  ref: string;
}

/** 1. NEW: Defines the shape of the introduction object */
export interface LevelIntro {
  title: string;
  subtitle: string;
  instructionsEn: string[];
  instructionsFil: string[];
  reminder?: string;
}

/** Represents a complete level document from Firestore. */
export interface Level {
  id: string;
  name: string;
  sectionId: string;
  order: number;
  type: "lesson_and_minigame" | "gesture_practice" | "quiz_survival";

  // --- 2. UPDATE: Add the new optional fields ---
  flow?: LevelFlowStep[]; // Optional, since Level 5 doesn't use it
  questionPool?: string[]; // Optional, only for survival levels
  introduction?: LevelIntro; // Optional, for levels with an intro slide
}

/** Represents a section document for the learning map. */
export interface Section {
  id: string;
  name: string;
  description: string;
  order: number;
  mascot: string;
  levels: number[];
  positions: { top: string; left: string }[];
  headerIcon: string;
  headerIconClass: string;
}

/** Represents the different stages of the gameplay loop. */
export type Phase =
  | "lesson"
  | "quiz_idle"
  | "quiz_ready"
  | "quiz_feedback"
  | "encouragement"
  | "saving"
  | "complete";
