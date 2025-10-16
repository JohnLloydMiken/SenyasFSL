import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Level, LevelFlowStep } from "shared/types/game";
import { Lesson, Question, } from "@/shared/types";

// Import all your game mode components
import MultipleChoice from "./MultipleChoice";
import TrueOrFalse from "./TrueOrFalse";
import LearnASign from "./LearnASign";
import FillTheGap from "./FillTheGap";
import VideoMC from "./VideoMC";
// ... import other game modes as needed

interface ContentAreaProps {
  levelData: Level;
  contentCache: Map<string, Lesson | Question>;
  onExit: (result: any) => void;
  onSaveProgress: (result: any) => Promise<void>;
}

export default function ContentArea({
  levelData,
  contentCache,
  onExit,
  onSaveProgress,
}: ContentAreaProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState({ xp: 0, senyasCoins: 0 });
  const [hearts, setHearts] = useState(3); // Example state

  const flow = levelData.flow || [];
  const currentStep: LevelFlowStep | undefined = flow[currentStepIndex];
  const currentContent = currentStep ? contentCache.get(currentStep.ref) : undefined;

  const handleNext = () => {
    if (currentStepIndex < flow.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Level complete
      onExit({ score, chestsEarned: 1 }); // Example result
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => ({ ...prev, xp: prev.xp + 10 }));
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
    }
    // You might want a small delay before moving to the next question
    setTimeout(handleNext, 1000);
  };

  if (!currentStep || !currentContent) {
    // Handle case where content is not found or flow is complete
    return (
      <View style={styles.container}>
        <Text>Loading content...</Text>
      </View>
    );
  }

  // Render the appropriate game mode based on the content type
  switch (currentContent.type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          {...(currentContent as Question)}
          onAnswer={handleAnswer}
        />
      );
    case "true_or_false":
      return (
        <TrueOrFalse
          {...(currentContent as Question)}
          onAnswer={handleAnswer}
        />
      );
    case "fill_in_the_gap":
        return (
            <FillTheGap
                {...(currentContent as Question)}
                onAnswer={handleAnswer}
            />
        );
    case "lesson":
      return (
        <LearnASign
          {...(currentContent as Lesson)}
          onPress={handleNext}
        />
      );
    // Add cases for your other game modes
    default:
      return (
        <View style={styles.container}>
          <Text>Unknown content type: {currentContent.type}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});