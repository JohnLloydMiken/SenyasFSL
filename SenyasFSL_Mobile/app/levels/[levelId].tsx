import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { getLevelData, getFlowContent } from "@/services/gameService";
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import VideoMC from "@/components/Game_Modes/VideoMC";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const [flowContent, setFlowContent] = useState<Map<string, any> | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // ⏬ Fetch Level Data and Flow
  useEffect(() => {
    const fetchLevelAndFlow = async () => {
      setLoading(true);
      try {
        const level = await getLevelData(`s1_lvl_${levelId}` as string);
        setLevelData(level);

        if (level?.flow) {
          const contentMap = await getFlowContent(level.flow);
          setFlowContent(contentMap);
        }
      } catch (error) {
        console.error("Error loading level:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelAndFlow();
  }, [levelId]);

  // ⏩ Move to next step or evaluation
  const handleNextStep = () => {
    if (levelData && currentStep + 1 < levelData.flow.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 🏁 When last step is done → Go to Evaluation screen
      router.push({
        pathname: "./Eval_phase",
        params: {
          levelId,
          lessons: JSON.stringify(
            // 👈 send lessons to recap
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

  // 🧩 Get current step data
  const flowStep =
    levelData?.flow && flowContent ? levelData.flow[currentStep] : null;
  const content =
    flowStep && flowContent ? flowContent.get(flowStep.ref) : null;

  // 🧠 Render Component based on type
  const renderStep = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading Level...</Text>
        </View>
      );
    }

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
  };

  return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
