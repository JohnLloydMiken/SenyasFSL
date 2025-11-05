import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Evaluation from "@/components/Game_Modes/Eval/Evaluation";
import { useUserPoints } from "@/utils/store/userGameEval";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CurrentStreak from "@/components/Game_Modes/Eval/CurrentStreak";
import ReminderNotif from "@/components/Game_Modes/Eval/ReminderNotif";
import LearningRecap from "@/components/Game_Modes/Eval/LearningRecap";

// ✅ 1. Import the necessary functions, type, and components
import { saveLevelProgress } from "@/services/gameService";
import { recordActivity } from "@/services/userService"; // ✅ Import recordActivity
import { CompleteLevelData } from "@/shared/types"; // Using "shared/types" as per your index
import Toast from "react-native-toast-message"; // For error handling
import { useUserStore } from "@/utils/store/useUserStore";
import { useSaveProgress } from "@/utils/store/useSaveProgress";
import { useSectionStore } from "@/utils/store/useSectionStore";

const Eval_phase = () => {
  const { levelId, lessons, questions } = useLocalSearchParams();
  const parsedLessons = lessons ? JSON.parse(lessons as string) : [];
  const router = useRouter();
  const { currentSectionOrder } = useSectionStore();
  const point = useUserPoints((state) => state.score ?? 0);
  const resetScore = useUserPoints((state) => state.resetScore);
  const totalQuestions = Number(questions) || 0;

  // ✅ 2. Use the new hook to get the 'mutate' function and loading state
  const { mutate: saveProgress, isLoading } = useSaveProgress();

  // ✅ 3. Add a new loading state for recording the streak
  const [isRecordingStreak, setIsRecordingStreak] = useState(false);

  const [step, setStep] = useState<
    "evaluation" | "streak" | "reminder" | "recap"
  >("evaluation");

  const calcEvalpoint = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((point / totalQuestions) * 100);
  };

  const calculateRewards = () => {
    const xpPerQuestion = 10;
    // --- THIS IS THE CHANGE ---
    const coinsPerQuestion = 10; // Changed from 5 to 10 to match the web app
    // ---
    const xpGained = point * xpPerQuestion;
    const senyasCoinsGained = point * coinsPerQuestion;
    const chestsEarned = point === totalQuestions && totalQuestions > 0 ? 1 : 0;

    return { xpGained, senyasCoinsGained, chestsEarned };
  };

  // ✅ 4. Simplify the "Continue" handler
  const handleSaveAndExit = () => {
    // This is no longer async, as the hook handles the async logic
    const { xpGained, senyasCoinsGained, chestsEarned } = calculateRewards();
    const normalizedLevelID = `s${currentSectionOrder}_lvl_${levelId}`;
    // Build the data payload
    const data: CompleteLevelData = {
      levelId: normalizedLevelID as string,

      xpGained,
      senyasCoinsGained,
      chestsEarned,
    };

    // Call the 'mutate' function from the hook
    saveProgress(data, {
      onSuccess: () => {
        // This code runs after the API call succeeds
        resetScore();
        router.push("/(main_interface)");
      },
      // onError is now handled automatically by the hook (shows toast, rolls back state)
    });
  };

  // ✅ 5. Create a new handler to call recordActivity
  const handleContinueFromEval = async () => {
    if (isRecordingStreak) return; // Prevent double-taps
    setIsRecordingStreak(true);
    try {
      await recordActivity();
      console.log("Streak activity recorded successfully.");
    } catch (error) {
      console.error("Failed to record streak activity:", error);
      // Don't block the user, just log the error and continue
    } finally {
      setIsRecordingStreak(false);
      setStep("streak"); // Move to the next step
    }
  };

  // ✅ 6. The loading state check is now driven by the hook AND our new state
  if (isLoading || isRecordingStreak) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB990F" />
          <Text style={styles.loadingText}>
            {isLoading
              ? "Saving your progress..."
              : "Updating your streak..."}
          </Text>
        </View>
      </>
    );
  }

  const renderContent = () => {
    switch (step) {
      case "evaluation":
        return (
          <Evaluation
            percent={calcEvalpoint()}
            onRetake={() => {
              resetScore();
              router.replace({
                pathname: "./[levelId]",
                params: { levelId },
              });
            }}
            onContinue={handleContinueFromEval} // ✅ Use the new handler
          />
        );

      case "streak":
        return (
          <CurrentStreak
            onContinue={() => setStep("reminder")}
            onShare={() => ""}
          />
        );

      case "reminder":
        return (
          <ReminderNotif
            onContinue={() => setStep("recap")}
            onRemind={() => setStep("recap")}
          />
        );

      case "recap":
        return (
          <LearningRecap
            lessons={parsedLessons}
            // ✅ 7. Use the simpler save/exit handler
            onContinue={handleSaveAndExit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default Eval_phase;