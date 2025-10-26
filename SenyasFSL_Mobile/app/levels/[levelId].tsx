// [levelId].tsx

import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  getLevelData,
  getFlowContent,
  getQuestionsFromPool, // Make sure this is imported
} from "@/services/gameService";
import Sign_Prcatice from "@/components/Game_Modes/SignLangRecog";
import FlowRenderer from "@/components/Game_Modes/FlowRenderer";
import BossFight from "@/components/Game_Modes/BossFight";
import { useSectionStore } from "@/utils/store/useSectionStore";
import { LevelData } from "@/utils/store/levelData";
export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const { currentSectionOrder } = useSectionStore();
  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const setLevelID = LevelData((state) => state.setLevelID);
  const [flowContent, setFlowContent] = useState<Map<string, any> | null>(null);

  useEffect(() => {
    const fetchLevelAndFlow = async () => {
      setLoading(true);
      try {
        // 👇 Check for all required params first
        if (!levelId || typeof levelId !== "string" || !currentSectionOrder) {
          console.warn("Missing levelId or sectionOrder, skipping fetch");
          return;
        }

        // 👇 **FIX 1: Construct the ID and set it in the store immediately**
        const fullLevelId = `s${currentSectionOrder}_lvl_${levelId}`;
        setLevelID(fullLevelId); // This updates the global store

        const level = await getLevelData(fullLevelId); // Now fetch with the same ID
        setLevelData(level);

        if (!level) return;

        let contentMap: Map<string, any> | null = null;

        // ✅ FIX: Check that the array property exists AND is not empty.
        // This satisfies TypeScript by confirming the value is not undefined.
        if (
          level.type === "quiz_survival" &&
          level.questionPool && // 👈 Check for existence first
          level.questionPool.length > 0
        ) {
          contentMap = await getQuestionsFromPool(level.questionPool);
        } else if (
          level.type === "lesson_and_minigame" &&
          level.flow && // 👈 Check for existence first
          level.flow.length > 0
        ) {
          contentMap = await getFlowContent(level.flow);
        }

        setFlowContent(contentMap);
      } catch (error) {
        console.error("Error loading level content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelAndFlow();
  }, [levelId, currentSectionOrder, setLevelID]);

  // ... The rest of your component remains the same

  const renderLevel = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading Level...</Text>
        </View>
      );
    }

    if (!levelData) {
      return (
        <View style={styles.center}>
          <Text>Could not load level data.</Text>
        </View>
      );
    }

    switch (levelData.type) {
      case "lesson_and_minigame":
        if (!flowContent) {
          return (
            <View style={styles.center}>
              <Text>Could not load content for this level.</Text>
            </View>
          );
        }
        return <FlowRenderer levelData={levelData} flowContent={flowContent} />;

      case "sign_practice":
        return <Sign_Prcatice level={levelId} />;

      case "quiz_survival":
        if (!flowContent) {
          return (
            <View style={styles.center}>
              <Text>Could not load quiz questions.</Text>
            </View>
          );
        }
        return <BossFight levelData={levelData} flowContent={flowContent} />;

      default:
        return (
          <View style={styles.center}>
            <Text>Unknown level type: {levelData.type}</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderLevel()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
