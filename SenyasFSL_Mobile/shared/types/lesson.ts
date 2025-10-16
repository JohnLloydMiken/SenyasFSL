// packages/shared/src/types/lesson.ts

/**
 * Represents a single lesson document in Firestore.
 * 👇 RENAMED HERE
 */
export interface ContentLesson {
  id: string; // The user-defined document ID, e.g., "lesson_letter_A"
  enTitle: string;
  filTitle: string;
  videoUrl: string;
}

// --- API Request and Result Types for Admin Lesson Management ---

// GET
export type GetLessonsResult = {
  lessons: ContentLesson[]; // <-- Use new name
};

// CREATE
export type CreateLessonData = ContentLesson; // <-- Use new name
export type CreateLessonResult = {
  status: "success";
  id: string;
};

// UPDATE
export type UpdateLessonData = {
  id: string;
  data: Partial<Omit<ContentLesson, "id">>; // <-- Use new name
};
export type UpdateLessonResult = {
  status: "success";
};

// DELETE
export type DeleteLessonData = {
  id: string;
};
export type DeleteLessonResult = {
  status: "success";
};
