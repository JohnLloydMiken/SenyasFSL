import { create } from "zustand";
import { shallow } from "zustand/shallow";
import {
  QuestionOption,
  Level,
} from "@/shared/types/index"; // Or from specific files like ../../types/question
import { ItemId, Inventory } from "@/shared/types/user";

// Imports from your existing services and stores
import { useItem as useItemService } from "@/services/gameService";
import { useUserStore } from "@/utils/store/useUserStore";
import { useAuthStore } from "@/utils/store/useAuthStore";
import Toast from "react-native-toast-message";

// Define the shape of the in-game state
interface GameStoreState {
  levelData: Level | null; // To check game mode for 'bomb'
  isXpDoubled: boolean;
  is2xTryActive: boolean;
  visibleChoices: QuestionOption[] | null; // For the 'bomb' item
  isUsingItem: boolean; // Loading state
  phase: string;
  nextStep: () => void; // Function to advance the game
}

// Define the actions
interface GameStoreActions {
  // Public actions
  useItem: (itemId: ItemId, currentInventory: Inventory) => Promise<void>;
  setVisibleChoices: (choices: QuestionOption[] | null) => void;
  clearGame: () => void; // Call this when the level is closed
  // Internal setters (for your game loop to call)
  _setLevelData: (level: Level | null) => void;
  _setPhase: (phase: string) => void;
  _setNextStep: (fn: () => void) => void; // Pass in your game's nextStep function
}

// Initial state of the store
const initialState: Omit<
  GameStoreState,
  "nextStep" | "_setLevelData" | "_setPhase" | "_setNextStep"
> = {
  levelData: null,
  isXpDoubled: false,
  is2xTryActive: false,
  visibleChoices: null,
  isUsingItem: false,
  phase: "loading",
};

export const useGameStore = create<GameStoreState & GameStoreActions>()(
  (set, get) => ({
    ...initialState,
    // --- Placeholders for your game loop ---
    nextStep: () => console.log("nextStep function not yet set"),
    _setLevelData: (level) => set({ levelData: level }),
    _setPhase: (phase) => set({ phase }),
    _setNextStep: (fn) => set({ nextStep: fn }),

    // --- Public Actions ---
    setVisibleChoices: (choices) => set({ visibleChoices: choices }),
    clearGame: () => set(initialState),

    useItem: async (itemId: ItemId, currentInventory: Inventory) => {
      if (get().isUsingItem) {
        console.log("Already using an item, please wait.");
        return;
      }

      if (
        !currentInventory ||
        !currentInventory[itemId] ||
        currentInventory[itemId] <= 0
      ) {
        Toast.show({
          type: "error",
          text1: "No Item!",
          text2: "You don't have any of this item.",
        });
        throw new Error("Item not available");
      }

      set({ isUsingItem: true });
      let originalState: Partial<GameStoreState> = {};

      try {
        // 1. APPLY OPTIMISTIC UI CHANGES
        if (itemId === "xpMultiply") {
          originalState.isXpDoubled = get().isXpDoubled;
          set({ isXpDoubled: true });
          Toast.show({
            type: "success",
            text1: "XP Doubled!",
            text2: "XP will be doubled for this level.",
          });
        } else if (itemId === "bomb") {
          const { visibleChoices, levelData } = get();

          // Rule: Bomb can only be used in quiz_survival
          if (levelData?.type !== "quiz_survival") {
            Toast.show({
              type: "error",
              text1: "Can't Use Bomb",
              text2: "Bomb can only be used in Quiz Survival!",
            });
            throw new Error("Item not usable in this mode.");
          }

          if (visibleChoices && visibleChoices.length > 2) {
            const incorrect = visibleChoices.filter((c) => !c.isCorrect);
            if (incorrect.length > 0) {
              originalState.visibleChoices = visibleChoices; // Save for rollback
              const choiceToRemove =
                incorrect[Math.floor(Math.random() * incorrect.length)];
              set({
                visibleChoices: visibleChoices.filter(
                  (c) => c.id !== choiceToRemove.id
                ),
              });
              Toast.show({
                type: "success",
                text1: "Bomb Used!",
                text2: "One incorrect answer removed.",
              });
            } else {
              throw new Error("Cannot use Bomb now (no incorrect choices).");
            }
          } else {
            throw new Error("Cannot use Bomb now (not enough choices).");
          }
        } else if (itemId === "skip") {
          Toast.show({
            type: "success",
            text1: "Skipped!",
            text2: "Question skipped.",
          });
          get().nextStep(); // Call the game's nextStep logic
        } else if (itemId === "twotry") {
          originalState.is2xTryActive = get().is2xTryActive;
          set({ is2xTryActive: true });
          Toast.show({
            type: "success",
            text1: "2x Try!",
            text2: "Your next answer has a safety net.",
          });
        }

        // 2. CALL THE "COMMUNICATOR" (Your function)
        // We pass the string value of itemId
        await useItemService(itemId);

        // 3. REFRESH USER DATA (to update inventory count)
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          await useUserStore.getState().fetchUserData(authUser);
        }
      } catch (error: any) {
        console.error("Failed to use item, rolling back:", error);
        Toast.show({
          type: "error",
          text1: "Failed to use item",
          text2: error.message || "Could not use item.",
        });

        // 4. ROLLBACK optimistic changes on error
        if (Object.keys(originalState).length > 0) {
          set(originalState);
          console.log("[GameStore] Rolled back optimistic item state.");
        }
        throw error; // Re-throw for the UI
      } finally {
        set({ isUsingItem: false });
      }
    },
  })
);
export type GameStore = GameStoreState & GameStoreActions;
