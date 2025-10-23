import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Evaluation from "@/components/Game_Modes/Eval/Evaluation";
import { useUserPoints } from "@/utils/store/userGameEval";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CurrentStreak from "@/components/Game_Modes/Eval/CurrentStreak";
import ReminderNotif from "@/components/Game_Modes/Eval/ReminderNotif";
import LearningRecap from "@/components/Game_Modes/Eval/LearningRecap";

// ✅ 1. Import the necessary function, type, and components
import { saveLevelProgress } from "@/services/gameService";
import { CompleteLevelData } from "@/shared/types"; // Using "shared/types" as per your index
import Toast from "react-native-toast-message"; // For error handling
import { useUserStore } from "@/utils/store/useUserStore";

const Eval_phase = () => {
  const { levelId, lessons, questions } = useLocalSearchParams();
  const parsedLessons = lessons ? JSON.parse(lessons as string) : [];
  const router = useRouter();

  // ✅ 2. Get both score and reset function from your store
  const point = useUserPoints((state) => state.score ?? 0);
  const resetScore = useUserPoints((state) => state.resetScore); // Get the reset function
  const totalQuestions = Number(questions) || 0;
  const updateUserData = useUserStore((state) => state.updateUserData);
  // ✅ 3. Add a loading state
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<
    "evaluation" | "streak" | "reminder" | "recap"
  >("evaluation");

  const calcEvalpoint = () => {
    // Prevent division by zero if there are no questions
    if (totalQuestions === 0) {
      return 0;
    }
    // Make sure percentage is rounded
    return Math.round((point / totalQuestions) * 100);
  };

  // ✅ 4. Define your reward logic (you can adjust this)
  const calculateRewards = () => {
    const xpPerQuestion = 10;
    const coinsPerQuestion = 5;
    const xpGained = point * xpPerQuestion;
    const senyasCoinsGained = point * coinsPerQuestion;

    // Award a chest for a perfect score
    const chestsEarned = point === totalQuestions && totalQuestions > 0 ? 1 : 0;

    return { xpGained, senyasCoinsGained, chestsEarned };
  };

  // ✅ 5. Create the final "Continue" handler
  const handleSaveAndExit = async () => {
    setIsLoading(true);
    try {
      const { xpGained, senyasCoinsGained, chestsEarned } = calculateRewards();

      // Build the data payload
      const data: CompleteLevelData = {
        levelId: levelId as string,
        xpGained,
        senyasCoinsGained,
        chestsEarned,
      };

      // Call the cloud function
      await saveLevelProgress(data);

      // Reset the score for the next level
      resetScore();

      // Navigate home
      router.push("/(main_interface)");
    } catch (error) {
      console.error("Failed to save progress:", error);
      Toast.show({
        type: "error",
        text1: "Save Error",
        text2: "Could not save your progress. Please try again.",
      });
      setIsLoading(false); // Only set loading to false on error
    }
  };

  // ✅ 6. Add loading state check
  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB990F" />
          <Text style={styles.loadingText}>Saving your progress...</Text>
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
              // ✅ 7. Add resetScore() on retake
              resetScore();
              router.replace({
                pathname: "./[levelId]",
                params: { levelId },
              });
            }}
            onContinue={() => setStep("streak")}
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
            onRemind={() => ""}
          />
        );

      case "recap":
        return (
          <LearningRecap
            lessons={parsedLessons}
            // ✅ 8. Use the new handler here
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
      {/* Make sure Toast is rendered at the top level of your app */}
      {/* <Toast /> */}
    </>
  );
};

// ✅ 9. Add styles for the loading view
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
