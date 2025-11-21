import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Evaluation from "@/components/Game_Modes/Eval/Evaluation";
import { useUserPoints } from "@/utils/store/userGameEval";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CurrentStreak from "@/components/Game_Modes/Eval/CurrentStreak";
import ReminderNotif from "@/components/Game_Modes/Eval/ReminderNotif";
import LearningRecap from "@/components/Game_Modes/Eval/LearningRecap";
import Toast from "react-native-toast-message";
import { checkAchievements } from "@/services/achievementService";
import { recordActivity } from "@/services/userService";
import { CompleteLevelData } from "@/shared/types";
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

  // Hook for saving level progress
  const { mutate: saveProgress, isLoading: isSavingLevel } = useSaveProgress();

  // Local state to handle the async 'recordActivity' before the mutation fires
  const [isProcessing, setIsProcessing] = useState(false);

  const [step, setStep] = useState<
    "evaluation" | "streak" | "reminder" | "recap"
  >("evaluation");

  const calcEvalpoint = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((point / totalQuestions) * 100);
  };

  const calculateRewards = () => {
    const xpPerQuestion = 10;
    const coinsPerQuestion = 10;
    const xpGained = point * xpPerQuestion;
    const senyasCoinsGained = point * coinsPerQuestion;
    const chestsEarned = point === totalQuestions && totalQuestions > 0 ? 1 : 0;

    return { xpGained, senyasCoinsGained, chestsEarned };
  };

  // ✅ Unified Handler: Records Streak -> Calculates Rewards -> Saves Level -> Exits
  const handleSaveAndExit = async () => {
    setIsProcessing(true);

    // 1. Record Activity (Streak) First
    try {
      await recordActivity();
      console.log("Streak activity recorded successfully.");
    } catch (error) {
      console.error("Failed to record streak activity:", error);
    }

    // 2. Prepare Data
    const { xpGained, senyasCoinsGained, chestsEarned } = calculateRewards();
    const normalizedLevelID = `s${currentSectionOrder}_lvl_${levelId}`;

    const data: CompleteLevelData = {
      levelId: normalizedLevelID as string,
      xpGained,
      senyasCoinsGained,
      chestsEarned,
    };

    // 3. Call the 'mutate' function from the hook
    saveProgress(data, {
      onSuccess: async () => {
        console.log("Level progress saved successfully.");

        // ✅ 4. CHECK FOR ACHIEVEMENTS AFTER SUCCESSFUL SAVE
        try {
          const achievementResult = await checkAchievements();

          if (
            achievementResult?.newlyUnlocked &&
            achievementResult.newlyUnlocked.length > 0
          ) {
            // Show toast for each newly unlocked achievement
            achievementResult.newlyUnlocked.forEach((achievement, index) => {
              setTimeout(() => {
                Toast.show({
                  type: "success",
                  text1: "🏆 Achievement Unlocked!",
                  text2: achievement.title,
                  visibilityTime: 4000,
                  position: "top",
                });
              }, index * 500); // Stagger toasts by 500ms if multiple achievements
            });

            console.log(
              "Newly unlocked achievements:",
              achievementResult.newlyUnlocked
            );
          }
        } catch (achErr) {
          console.error("Failed to check achievements:", achErr);
          // Don't block the user flow if achievement check fails
        }

        // 5. Continue with normal flow
        resetScore();
        router.push("/(main_interface)");
      },
      onError: () => {
        setIsProcessing(false);
      },
    });
  };

  // ✅ Combined Loading State
  if (isSavingLevel || isProcessing) {
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
              resetScore();
              router.replace({
                pathname: "./[levelId]",
                params: { levelId },
              });
            }}
            // ✅ Just move to next step, do not save yet
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
            onRemind={() => setStep("recap")}
          />
        );

      case "recap":
        return (
          <LearningRecap
            lessons={parsedLessons}
            // ✅ This now triggers the unified save sequence
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
