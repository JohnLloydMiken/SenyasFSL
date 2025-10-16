import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export type Option = {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
};

export type Question = {
  id: string;
  enPrompt: string;
  filPrompt: string;
  options: Option[];
  type: string;
  videoUrl?: string;
};

/**
 * Fetch all questions from Firestore
 */
export const fetchAllQuestions = async (): Promise<Question[]> => {
  const questionsCol = collection(db, "questions");
  const snapshot = await getDocs(questionsCol);

  const questions: Question[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Question[];

  return questions;
};
