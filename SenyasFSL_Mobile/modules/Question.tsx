export enum Question_type {
  MULTIPLE_CHOICE = "multiplke_choice",
  LEARN_A_SIGN = "learn_a_sign",
  VIDEO_IDENTIFICATION = "video_identification",
  WORD_IDENTIFICATION = "word_identification",
  TRUE_OR_FALSE = "true_or_false",
}
export interface QuestionsProps {
  id: string;
  type: Question_type;
  question: string;
  category: string;
  points: number;
  media?: {
    video?: string;
    image?: string;
    aduio?: string;
  };
}

export interface MULTIPLE_CHOICE_QUESTIONS extends QuestionsProps {
  type: Question_type.MULTIPLE_CHOICE;
  options: string[];
  correct_answer: number;
  video: Array<{
    id: string;
    url: string;
  }>;
}

export interface LEARN_A_SIGN_QUESTION extends QuestionsProps {
  type: Question_type.LEARN_A_SIGN;
  video: Array<{
    id: string;
    url: string;
  }>;
  text: string;
}
export interface VIDEO_IDENTIFICATION_QUESTION extends QuestionsProps {
  type: Question_type.VIDEO_IDENTIFICATION;
  video: Array<{
    id: string;
    url: string;
  }>;
  correctVideo: string[];
}
export interface WORD_IDENTIFICATION_QUESTION extends QuestionsProps {
  type: Question_type.WORD_IDENTIFICATION;
  video: Array<{
    id: string;
    url: string;
  }>;

  options: string[];
  correct_answer: number;
}
export interface TRUE_OR_FALSE_QUESTION extends QuestionsProps {
  type: Question_type.TRUE_OR_FALSE;
  correct_answer: boolean;
}
export type Question =
  | MULTIPLE_CHOICE_QUESTIONS
  | LEARN_A_SIGN_QUESTION
  | VIDEO_IDENTIFICATION_QUESTION
  | WORD_IDENTIFICATION_QUESTION
  | TRUE_OR_FALSE_QUESTION;

export interface LevelContent {
    levelId: number;
    section: number;
    title: string;
    description: string;
    questions: Question[]
}
