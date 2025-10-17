import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { getLevelData, getFlowContent } from "@/services/gameService";
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import VideoMC from "@/components/Game_Modes/VideoMC";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const [flowContent, setFlowContent] = useState<Map<string, any> | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchLevelAndFlow = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch level data (like title, flow, intro, etc.)
        const level = await getLevelData(`s1_lvl_${levelId}` as string);
        setLevelData(level);

        // 2️⃣ Fetch lesson & question content referenced in flow
        if (level && level.flow) {
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

  // 3️⃣ Get the current step data
  const flowStep =
    levelData?.flow && flowContent ? levelData.flow[currentStep] : null;

  const content =
    flowStep && flowContent ? flowContent.get(flowStep.ref) : null;

  // 4️⃣ Decide which component to show
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

    // LESSON TYPE
    if (flowStep.type === "lesson") {
      return (
        <LearnASign
          key={content.id}
          title={content.enTitle}
          videoURL={content.videoUrl}
          EnglishText={content.enTitle}
          FilipinoText={content.filTitle}
          onPress={() =>
            setCurrentStep((prev) =>
              prev + 1 < levelData.flow.length ? prev + 1 : prev
            )
          }
        />
      );
    }

    // QUESTION TYPE
    if (flowStep.type === "question") {
      const qType = content.type; // e.g. "multiple_choice", "true_false", etc.

      switch (qType) {
        case "multiple_choice":
          return (
            <MultipleChoice
              key={content.id}
              enPrompt={content.enPrompt}
              filPrompt={content.filPrompt}
              videoUrl={content.videoUrl}
              options={content.options}
              onPress={() =>
                setCurrentStep((prev) =>
                  prev + 1 < levelData.flow.length ? prev + 1 : prev
                )
              }
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
              onPress={() =>
                setCurrentStep((prev) =>
                  prev + 1 < levelData.flow.length ? prev + 1 : prev
                )
              }
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
              onPress={() =>
                setCurrentStep((prev) =>
                  prev + 1 < levelData.flow.length ? prev + 1 : prev
                )
              }
            />
          );
        case "multiple_choice_video":
          return (
            <VideoMC
              key={content.id}
              enPrompt={content.enPrompt}
              filPrompt={content.filPrompt}
              options={content.options}
              onPress={() =>
                setCurrentStep((prev) =>
                  prev + 1 < levelData.flow.length ? prev + 1 : prev
                )
              }
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
