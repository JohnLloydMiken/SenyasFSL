// components/Game_Modes/FlowRenderer.tsx

import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import VideoMC from "@/components/Game_Modes/VideoMC";
import { LevelData } from "@/utils/store/levelData";
interface FlowRendererProps {
  levelData: any;
  flowContent: Map<string, any>;
}

export default function FlowRenderer({ levelData, flowContent }: FlowRendererProps) {
  const { levelId } = useLocalSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const setLevelStep = LevelData((state) => state.setLevelStep);

  useEffect(() => {
    setLevelStep(currentStep);
  }, [currentStep, setLevelStep]);

  const handleNextStep = () => {
    if (levelData && currentStep + 1 < levelData.flow.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push({
        pathname: "./Eval_phase",
        params: {
          levelId,
          questions: levelData.flow.filter((f: any) => f.type === "question").length,
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
  };

  const flowStep = levelData?.flow[currentStep];
  const content = flowStep ? flowContent.get(flowStep.ref) : null;

  // ✅ FIX: setLevelStep inside useEffect
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

  // 🧠 LESSON TYPE
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

  // 🧩 QUESTION TYPE
  if (flowStep.type === "question") {
    const qType = content.type?.toLowerCase();

    switch (qType) {
      case "multiple_choice":
        return (
          <MultipleChoice
            key={content.id}
            enPrompt={content.enPrompt}
            filPrompt={content.filPrompt}
            videoUrl={content.videoUrl}
            options={content.options}
            onPress={handleNextStep}
          />
        );
      case "fill_in_the_gap":
        return (
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
      case "true_or_false":
        return (
          <TrueOrFalse
            key={content.id}
            enQuestion={content.enPrompt}
            filQuestion={content.filPrompt}
            options={content.options}
            videoURL={content.videoUrl}
            onPress={handleNextStep}
          />
        );
      case "multiple_choice_video":
        return (
          <VideoMC
            key={content.id}
            enPrompt={content.enPrompt}
            filPrompt={content.filPrompt}
            options={content.options}
            onPress={handleNextStep}
          />
        );
      default:
        return (
          <View style={styles.center}>
            <Text>Unknown question type: {qType}</Text>
          </View>
        );
    }
  }

  return (
    <View style={styles.center}>
      <Text>Unknown step type: {flowStep.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
