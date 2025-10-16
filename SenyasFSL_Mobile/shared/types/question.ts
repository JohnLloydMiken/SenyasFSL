// packages/shared/src/types/question.ts

// Define the possible question types
export type QuestionType =
  | "multiple_choice"
  | "fill_in_the_gap"
  | "multiple_choice_video"
  | "true_or_false";

// --- Option Types ---

// Base for all options
export interface OptionBase {
  // 👈 ADD EXPORT
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
}

// Option type for Multiple Choice Video, which includes a video source
export interface VideoOption extends OptionBase {
  // 👈 ADD EXPORT
  videoSrc: string; // gs:// URL
}

// --- Question Types ---

interface ContentQuestionBase {
  // Renamed
  id: string;
  enPrompt: string;
  filPrompt: string;
  type: QuestionType;
}

export interface ContentStandardQuestion extends ContentQuestionBase {
  // Renamed
  type: "multiple_choice" | "fill_in_the_gap" | "true_or_false";
  videoUrl: string;
  options: OptionBase[];
}

// Type for 'multiple_choice_video'
export interface ContentVideoQuestion extends ContentQuestionBase {
  // Renamed
  type: "multiple_choice_video";
  options: VideoOption[];
}

// A union type that can represent any question document
export type ContentQuestion = ContentStandardQuestion | ContentVideoQuestion; // Renamed

// --- API Request and Result Types for Admin Management ---

export type GetQuestionsResult = { questions: ContentQuestion[] }; // Updated
export type CreateQuestionData = ContentQuestion; // Updated
export type CreateQuestionResult = { status: "success"; id: string };
export type UpdateQuestionData = {
  id: string;
  data: Partial<Omit<ContentQuestion, "id">>;
}; // Updated
export type UpdateQuestionResult = { status: "success" };
export type DeleteQuestionData = { id: string };
export type DeleteQuestionResult = { status: "success" };
