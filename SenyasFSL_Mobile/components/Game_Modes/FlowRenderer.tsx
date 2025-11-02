// components/Game_Modes/FlowRenderer.tsx
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useCallback } from "react"; // ✅ Import useCallback
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import VideoMC from "@/components/Game_Modes/VideoMC";
import { LevelData } from "@/utils/store/levelData";
import Inventory from "../main_interface/treasure/Inventory";
import { useGameStore } from "@/hooks/useGameStore";

interface FlowRendererProps {
  levelData: any;
  flowContent: Map<string, any>;
}

export default function FlowRenderer({
  levelData,
  flowContent,
}: FlowRendererProps) {
  const { levelId } = useLocalSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const setLevelStep = LevelData((state) => state.setLevelStep);
  const [isInventoryClicked, setIsInventoryClicked] = useState(false);

  // --- Zustand Game Store Integration ---
  const _setLevelData = useGameStore((state) => state._setLevelData);
  const _setPhase = useGameStore((state) => state._setPhase);
  const _setNextStep = useGameStore((state) => state._setNextStep);
  const clearGame = useGameStore((state) => state.clearGame);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);

  // ✅ Wrap handleNextStep in useCallback
  const handleNextStep = useCallback(() => {
    if (levelData && currentStep + 1 < levelData.flow.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push({
        pathname: "./Eval_phase",
        params: {
          levelId,
          questions: levelData.flow.filter((f: any) => f.type === "question")
            .length,
          lessons: JSON.stringify(
            levelData.flow
              .filter((f: any) => f.type === "lesson")
              .map((f: any) => {
                const c = flowContent?.get(f.ref);
                return {
                  id: c?.id,
                  enTitle: c?.enTitle,
                  filTitle: c?.filTitle,
                  videoUrl: c?.videoUrl,
                };
              })
          ),
        },
      });
    }
  }, [levelData, currentStep, router, levelId, flowContent]); // Dependencies for handleNextStep

  // ✅ FIX: This hook's dependency array is corrected to prevent loops.
  useEffect(() => {
    _setLevelData(levelData);
    _setPhase("playing");
    _setNextStep(handleNextStep); // Now uses the stable useCallback version

    return () => {
      clearGame();
      _setLevelData(null);
    };
  }, [levelData, handleNextStep]); // ✅ Only depends on data and the stable callback

  // Update visible choices when step changes
  useEffect(() => {
    const flowStep = levelData?.flow[currentStep];
    const content = flowStep ? flowContent.get(flowStep.ref) : null;
    if (content && content.options) {
      setVisibleChoices(content.options);
    } else {
      setVisibleChoices(null);
    }
  }, [currentStep, levelData, flowContent, setVisibleChoices]); // This is fine

  useEffect(() => {
    setLevelStep(currentStep);
  }, [currentStep, setLevelStep]);

  const flowStep = levelData?.flow[currentStep];
  const content = flowStep ? flowContent.get(flowStep.ref) : null;

  useEffect(() => {
    if (flowStep?.step !== undefined) {
      setLevelStep(flowStep.step);
    }
  }, [flowStep, setLevelStep]);

  if (!flowStep || !content) {
    return (
      <View style={styles.center}>
        <Text>No content found for this step.</Text>
      </View>
    );
  }

  // --- Render Logic ---

  // 🧠 LESSON TYPE (No Inventory)
  if (flowStep.type === "lesson") {
    return (
      <LearnASign
        key={content.id}
        title={content.enTitle}
        videoURL={content.videoUrl}
        EnglishText={content.enTitle}
        FilipinoText={content.filTitle}
        onPress={handleNextStep}
      />
    );
  }

  // 🧩 QUESTION TYPE (Show Inventory)
  let QuestionComponent;
  const qType = content.type?.toLowerCase();

  switch (qType) {
    case "multiple_choice":
      QuestionComponent = (
        <MultipleChoice
          key={content.id}
          enPrompt={content.enPrompt}
          filPrompt={content.filPrompt}
          videoUrl={content.videoUrl}
          options={content.options}
          onPress={handleNextStep}
        />
      );
      break;
    case "fill_in_the_gap":
      QuestionComponent = (
        <FillTheGap
          key={content.id}
          enPrompt={content.enPrompt}
          filPrompt={content.filPrompt}
          message="Alright!"
          videoURL={content.videoUrl}
          options={content.options}
          onPress={handleNextStep}
        />
      );
      break;
    case "true_or_false":
      QuestionComponent = (
        <TrueOrFalse
          key={content.id}
          enQuestion={content.enPrompt}
          filQuestion={content.filPrompt}
          options={content.options}
          videoURL={content.videoUrl}
          onPress={handleNextStep}
        />
      );
      break;
    case "multiple_choice_video":
      QuestionComponent = (
        <VideoMC
          key={content.id}
          enPrompt={content.enPrompt}
          filPrompt={content.filPrompt}
          options={content.options}
          onPress={handleNextStep}
        />
      );
      break;
    default:
      QuestionComponent = (
        <View style={styles.center}>
          <Text>Unknown question type: {qType}</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      {QuestionComponent}

  
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 16,
    zIndex: 50,
  },
});
