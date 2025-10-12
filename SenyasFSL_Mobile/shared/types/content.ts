// shared/types/content.ts
// The generic shape of data from our 'lessons' collection in Firestore
export interface Lesson {
  id: string;
  enTitle: string; // CHANGED from title
  filTitle: string; // ADDED
  videoUrl: string;
  imageUrl?: string;
}

// The single "source of truth" for what a quiz choice can look like
export interface QuestionOption {
  id: string;
  labelEn?: string;
  labelFil?: string;
  videoSrc?: string;
  isCorrect?: boolean;
}

// The generic shape of data from our 'questions' collection in Firestore
export interface Question {
  id: string;
  type:
    | "multiple_choice"
    | "fill_in_the_gap"
    | "true_or_false"
    | "multiple_choice_video";
  enPrompt: string; // CHANGED from prompt
  filPrompt: string; // ADDED
  videoUrl?: string;
  options?: QuestionOption[];
  correctAnswer?: any;
  sentence?: string;
  choices?: QuestionOption[];
}

// --- SPECIFIC SHAPES FOR UI COMPONENTS ---
// These types represent the props passed to components, so they remain the same.

export interface LessonContent {
  type: "lesson";
  videoSrc?: string;
  labelEn?: string;
  labelFil?: string;
}

export interface QuizVideoContent {
  type: "multiple_choice_video";
  question: string;
  questionFil: string; // ✅ Add this line
  videoSrc?: string;
  choices: QuestionOption[];
}

export interface FillInTheGapContent {
  type: "fill_in_the_gap";
  question: string; // ✅ Changed from 'sentence'
  questionFil?: string;
  videoSrc?: string; // ✅ Changed from 'sentenceFil'
  choices: QuestionOption[];
}

export interface TrueOrFalseContent {
  type: "true_or_false";
  question: string;
  questionFil?: string; // ADDED to support the new field
  videoSrc?: string;
  choices: QuestionOption[];
}

// Add the missing properties to this interface.
export interface DefaultQuizContent {
  type: "default_quiz";
  question: string; // ✅ Add this line
  questionFil: string; // ✅ Add this line
  videoSrc?: string;
  choices: QuestionOption[];
}

// A union of all possible content types for the game stage
export type GameContent =
  | LessonContent
  | QuizVideoContent
  | FillInTheGapContent
  | TrueOrFalseContent
  | DefaultQuizContent;