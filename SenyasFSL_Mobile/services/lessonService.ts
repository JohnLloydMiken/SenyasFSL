// src/services/lessonService.ts

import { getFunctions, httpsCallable } from "firebase/functions";
import {
  GetLessonsResult,
  CreateLessonData,
  CreateLessonResult,
  UpdateLessonData,
  UpdateLessonResult,
  DeleteLessonData,
  DeleteLessonResult,
  ContentLesson,
} from "@/shared/types";

const functions = getFunctions();

const getLessonsAdmin = httpsCallable<void, GetLessonsResult>(
  functions,
  "getLessonsAsAdmin"
);
const createLessonAdmin = httpsCallable<CreateLessonData, CreateLessonResult>(
  functions,
  "createLessonAsAdmin"
);
const updateLessonAdmin = httpsCallable<UpdateLessonData, UpdateLessonResult>(
  functions,
  "updateLessonAsAdmin"
);
const deleteLessonAdmin = httpsCallable<DeleteLessonData, DeleteLessonResult>(
  functions,
  "deleteLessonAsAdmin"
);

export const lessonService = {
  get: async (): Promise<ContentLesson[]> => {
    const result = await getLessonsAdmin();
    return result.data.lessons;
  },
  create: async (data: CreateLessonData): Promise<CreateLessonResult> => {
    const result = await createLessonAdmin(data);
    return result.data;
  },
  update: async (
    id: string,
    data: Partial<Omit<ContentLesson, "id">>
  ): Promise<UpdateLessonResult> => {
    const result = await updateLessonAdmin({ id, data });
    return result.data;
  },
  delete: async (id: string): Promise<DeleteLessonResult> => {
    const result = await deleteLessonAdmin({ id });
    return result.data;
  },
};
