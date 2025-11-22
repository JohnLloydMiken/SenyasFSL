// src/store/useGameProgressStore.ts
import { create } from "zustand";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"; // adjust to your firebase utils path
import type { LevelFlowStep, QuestionOption } from "@/shared/types"; // adapt types as needed

// ---- types ----
// simple debounce without lodash
function debounceFn<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export interface LevelSaveState {
  visibleChoices: QuestionOption[] | null; // allow array or null
  phase: string;
  isXpDoubled: boolean;
  is2xTryActive: boolean;
  currentStep: number;
  lives: number;
  tempScore: { xp: number; senyasCoins: number };
  gameFlow?: LevelFlowStep[];
  correctAnswersInARow?: number;
  chestsEarned?: number;
}


// small helper to create asyncstorage keys
const localKey = (userId: string | undefined, levelId: string) =>
  `@game:levelSave:${userId ?? "anon"}:${levelId}`;

// ---- AsyncStorage helpers (fallback) ----
async function saveToLocal(levelId: string, stateToSave: LevelSaveState) {
  try {
    const userId = auth.currentUser?.uid ?? "anon";
    await AsyncStorage.setItem(localKey(userId, levelId), JSON.stringify(stateToSave));
    // console.log(`[LocalSave] saved for ${levelId}`);
  } catch (err) {
    console.warn("[LocalSave] failed:", err);
  }
}

async function loadFromLocal(levelId: string): Promise<LevelSaveState | null> {
  try {
    const userId = auth.currentUser?.uid ?? "anon";
    const raw = await AsyncStorage.getItem(localKey(userId, levelId));
    if (!raw) return null;
    return JSON.parse(raw) as LevelSaveState;
  } catch (err) {
    console.warn("[LocalLoad] failed:", err);
    return null;
  }
}

async function removeFromLocal(levelId: string) {
  try {
    const userId = auth.currentUser?.uid ?? "anon";
    await AsyncStorage.removeItem(localKey(userId, levelId));
    // console.log(`[LocalRemove] removed ${levelId}`);
  } catch (err) {
    console.warn("[LocalRemove] failed:", err);
  }
}

// ---- Firestore save (debounced) ----
const debouncedFirestoreSave = debounceFn(
  async (levelId: string, stateToSave: LevelSaveState) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      await saveToLocal(levelId, stateToSave);
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        [`levelSaveStates.${levelId}`]: stateToSave,
      });

      await saveToLocal(levelId, stateToSave); // Keep local fallback
    } catch (err) {
      console.warn("[FirestoreSave] failed, saved locally instead:", err);
      await saveToLocal(levelId, stateToSave);
    }
  },
  2000
);


// immediate flush helper for end-of-level
async function flushFirestoreSave(levelId: string, stateToSave: LevelSaveState) {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    await saveToLocal(levelId, stateToSave);
    return;
  }
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      [`levelSaveStates.${levelId}`]: stateToSave,
    });
    await saveToLocal(levelId, stateToSave);
    // console.log(`[FirestoreFlush] saved for ${levelId}`);
  } catch (err) {
    console.warn("[FirestoreFlush] failed, saved locally:", err);
    await saveToLocal(levelId, stateToSave);
  }
}

// remove from firestore
async function removeGameStateFromFirestore(levelId: string) {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    await removeFromLocal(levelId);
    return;
  }
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      [`levelSaveStates.${levelId}`]: deleteField(),
    });
    await removeFromLocal(levelId);
    // console.log(`[FirestoreRemove] removed ${levelId}`);
  } catch (err) {
    console.warn("[FirestoreRemove] failed, removing local only", err);
    await removeFromLocal(levelId);
  }
}

// load from firestore (tries firestore then local fallback)
async function loadFromFirestore(levelId: string): Promise<LevelSaveState | null> {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return loadFromLocal(levelId);
  }
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return loadFromLocal(levelId);
    const data = snap.data();
    const saved = data?.levelSaveStates?.[levelId] ?? null;
    if (saved) return saved as LevelSaveState;
    // fallback to local if server doesn't have it
    return loadFromLocal(levelId);
  } catch (err) {
    console.warn("[LoadFirestore] failed, fallback to local", err);
    return loadFromLocal(levelId);
  }
}

// ---- Zustand store ----
interface ProgressStore {
  // minimal state for this helper store
  saveLocalState: (levelId: string, state: LevelSaveState) => void;
  save: (levelId: string, state: LevelSaveState) => void; // debounced firestore save
  flushSave: (levelId: string, state: LevelSaveState) => Promise<void>; // immediate
  load: (levelId: string) => Promise<LevelSaveState | null>;
  remove: (levelId: string) => Promise<void>;
  cancelPendingSaves: () => void;
}

export const useGameProgressStore = create<ProgressStore>((set, get) => ({
  saveLocalState: async (levelId, state) => {
    await saveToLocal(levelId, state);
  },

  save: (levelId, state) => {
    debouncedFirestoreSave(levelId, state);
  },

  flushSave: async (levelId, state) => {
    // calls immediate flush
    await flushFirestoreSave(levelId, state);
  },

  load: async (levelId) => {
    const loaded = await loadFromFirestore(levelId);
    return loaded;
  },

  remove: async (levelId) => {
    await removeGameStateFromFirestore(levelId);
  },

  cancelPendingSaves: () => {
    debouncedFirestoreSave.cancel();
  },
}));
