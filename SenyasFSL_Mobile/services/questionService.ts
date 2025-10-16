// src/services/questionService.ts
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  ContentQuestion,
  GetQuestionsResult,
  CreateQuestionData,
  CreateQuestionResult,
  UpdateQuestionData,
  UpdateQuestionResult,
  DeleteQuestionData,
  DeleteQuestionResult,
} from "@/shared/types";

const functions = getFunctions();

const getAdmin = httpsCallable<void, GetQuestionsResult>(
  functions,
  "getQuestionsAsAdmin"
);
const createAdmin = httpsCallable<CreateQuestionData, CreateQuestionResult>(
  functions,
  "createQuestionAsAdmin"
);
const updateAdmin = httpsCallable<UpdateQuestionData, UpdateQuestionResult>(
  functions,
  "updateQuestionAsAdmin"
);
const deleteAdmin = httpsCallable<DeleteQuestionData, DeleteQuestionResult>(
  functions,
  "deleteQuestionAsAdmin"
);

export const questionService = {
  get: async (): Promise<ContentQuestion[]> =>
    (await getAdmin()).data.questions,
  create: async (data: CreateQuestionData) => (await createAdmin(data)).data,
  update: async (id: string, data: Partial<Omit<ContentQuestion, "id">>) =>
    (await updateAdmin({ id, data })).data,
  delete: async (id: string) => (await deleteAdmin({ id })).data,
};
