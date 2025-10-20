import { View } from "react-native";
import React, { useState } from "react";
import Evaluation from "@/components/Game_Modes/Eval/Evaluation";
import { useUserPoints } from "@/utils/store/userGameEval";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CurrentStreak from "@/components/Game_Modes/Eval/CurrentStreak";
import ReminderNotif from "@/components/Game_Modes/Eval/ReminderNotif";
import LearningRecap from "@/components/Game_Modes/Eval/LearningRecap";

const Eval_phase = () => {
  const { levelId, lessons, questions } = useLocalSearchParams();
  const parsedLessons = lessons ? JSON.parse(lessons as string) : [];
  const router = useRouter();
  const point = useUserPoints((state) => state.score ?? 0);
  
  const [step, setStep] = useState<
    "evaluation" | "streak" | "reminder" | "recap"
  >("evaluation");

  const calcEvalpoint = () => {
  // Prevent division by zero if there are no questions
  if (!questions || Number(questions) === 0) {
    return 0;
  }
  return (point / Number(questions)) * 100;
};

  const renderContent = () => {
    switch (step) {
      case "evaluation":
        console.log(questions)
        return (
          <Evaluation
            percent={calcEvalpoint()}
            onRetake={() =>
              router.replace({
                pathname: "./[levelId]",
                params: { levelId },
              })
            }
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
            onContinue={() => router.push("/(main_interface)")}
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

export default Eval_phase;
