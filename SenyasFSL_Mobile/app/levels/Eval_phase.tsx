import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import Evaluation from "@/components/Game_Modes/Eval/Evaluation";
import FailedLevel from "@/components/Game_Modes/Eval/FailedLevel";
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
import { useUserStore } from "@/utils/store/useUserStore"; // ✅ Import user store
import { shareStreak } from "@/utils/shareUtils";

const Eval_phase = () => {
  const { levelId, lessons, questions, levelType } = useLocalSearchParams();
  const parsedLessons = lessons ? JSON.parse(lessons as string) : [];
  const router = useRouter();
  const { currentSectionOrder } = useSectionStore();
  const point = useUserPoints((state) => state.score ?? 0);
  const resetScore = useUserPoints((state) => state.resetScore);
  const totalQuestions = Number(questions) || 0;

  // ✅ Get user data to check if level is already completed
  const { userData } = useUserStore();

  // Hook for saving level progress
  const { mutate: saveProgress, isLoading: isSavingLevel } = useSaveProgress();

  // Local state to handle the async 'recordActivity' before the mutation fires
  const [isProcessing, setIsProcessing] = useState(false);

  const [step, setStep] = useState<
    "evaluation" | "failed" | "streak" | "reminder" | "recap"
  >("evaluation");

  const calcEvalpoint = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((point / totalQuestions) * 100);
  };

  // ✅ Check if this level was already completed
  const isLevelAlreadyCompleted = useMemo(() => {
    if (!userData?.progress || !currentSectionOrder || !levelId) {
      return false;
    }

    const sectionKey = `s${currentSectionOrder}`;
    const levelIndex = Number(levelId);
    const completedLevels = userData.progress[sectionKey];

    if (!Array.isArray(completedLevels)) {
      return false;
    }

    return completedLevels.includes(levelIndex);
  }, [userData?.progress, currentSectionOrder, levelId]);

  const calculateRewards = () => {
    const xpPerQuestion = 10;
    const coinsPerQuestion = 10;

    // ✅ If level was already completed, return 0 rewards
    if (isLevelAlreadyCompleted) {
      return {
        xpGained: 0,
        senyasCoinsGained: 0,
        chestsEarned: 0,
      };
    }

    // Normal reward calculation
    const xpGained = point * xpPerQuestion;
    const senyasCoinsGained = point * coinsPerQuestion;
    const chestsEarned = point === totalQuestions && totalQuestions > 0 ? 1 : 0;

    return { xpGained, senyasCoinsGained, chestsEarned };
  };

  // ✅ Check if user failed (below 70% AND level type is lesson_and_minigame)
  const scorePercent = calcEvalpoint();
  const isLessonAndMinigame = levelType === "lesson_and_minigame";
  const hasFailed = isLessonAndMinigame && scorePercent < 70;

  // ✅ Unified Handler: Records Streak -> Calculates Rewards -> Saves Level -> Exits
  const handleSaveAndExit = async () => {
    setIsProcessing(true);

    // ✅ 1. Record Activity (Streak) - ONLY if level wasn't already completed
    if (!isLevelAlreadyCompleted) {
      try {
        await recordActivity();
        console.log("Streak activity recorded successfully.");
      } catch (error) {
        console.error("Failed to record streak activity:", error);
      }
    } else {
      console.log("Level already completed - skipping streak recording.");
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

        // ✅ 4. CHECK FOR ACHIEVEMENTS - ONLY if level wasn't already completed
        if (!isLevelAlreadyCompleted) {
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
                }, index * 500);
              });

              console.log(
                "Newly unlocked achievements:",
                achievementResult.newlyUnlocked
              );
            }
          } catch (achErr) {
            console.error("Failed to check achievements:", achErr);
          }
        } else {
          console.log("Level already completed - skipping achievement check.");
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

  // ✅ Handler for retaking the level (no save, just reset and restart)
  const handleRetake = () => {
    resetScore();
    router.replace({
      pathname: "./[levelId]",
      params: { levelId },
    });
  };

  // ✅ Combined Loading State
  if (isSavingLevel || isProcessing) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB990F" />
          <Text style={styles.loadingText}>
            {isLevelAlreadyCompleted
              ? "Completing replay..."
              : "Saving your progress..."}
          </Text>
        </View>
      </>
    );
  }

  const { xpGained, senyasCoinsGained } = calculateRewards();

  const renderContent = () => {
    switch (step) {
      case "evaluation":
        // ✅ If user failed, show FailedLevel instead
        if (hasFailed) {
          return (
            <FailedLevel
              onNext={() =>
                router.replace({
                  pathname: "./[levelId]",
                  params: { levelId },
                })
              }
              onRetake={handleRetake}
            />
          );
        }

        // ✅ Show normal Evaluation (will display 0 XP/coins if already completed)
        return (
          <Evaluation
            percent={scorePercent}
            xp={xpGained}
            coins={senyasCoinsGained}
            onRetake={handleRetake}
            onContinue={() => setStep("streak")}
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
            onContinue={handleSaveAndExit}
          />
        );

      case "streak":
        return <CurrentStreak onContinue={() => setStep("reminder")} />;

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
