// levels/[levelId].tsx

import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  getLevelData,
  getFlowContent,
  getQuestionsFromPool,
} from "@/services/gameService";

import SignPracticeFlow from "@/components/Game_Modes/GesturePracticeFlow"; 
import FlowRenderer from "@/components/Game_Modes/FlowRenderer";
import BossFight from "@/components/Game_Modes/BossFight";
import { useSectionStore } from "@/utils/store/useSectionStore";
import { LevelData } from "@/utils/store/levelData";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const router = useRouter(); 
  const { currentSectionOrder } = useSectionStore();
  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const setLevelID = LevelData((state) => state.setLevelID);
  const [flowContent, setFlowContent] = useState<Map<string, any> | null>(null);

  useEffect(() => {
    const fetchLevelAndFlow = async () => {
      setLoading(true);
      try {
        if (!levelId || typeof levelId !== "string" || !currentSectionOrder) {
          console.warn("Missing levelId or sectionOrder, skipping fetch");
          return;
        }

        const fullLevelId = `s${currentSectionOrder}_lvl_${levelId}`;
        setLevelID(fullLevelId);

        const level = await getLevelData(fullLevelId);
        setLevelData(level);

        if (!level) return;

        let contentMap: Map<string, any> | null = null;

        if (
          level.type === "quiz_survival" &&
          level.questionPool &&
          level.questionPool.length > 0
        ) {
          contentMap = await getQuestionsFromPool(level.questionPool);
        } else if (
          (level.type === "lesson_and_minigame" || level.type === "sign_practice") && 
          level.flow &&
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
        if (!flowContent) { 
          return (
            <View style={styles.center}>
              <Text>Could not load practice signs.</Text>
            </View>
          );
        }
        return (
          <SignPracticeFlow
            levelData={levelData} 
            flowContent={flowContent} 
            onPress={() => {
              router.push({
                pathname: "./Eval_phase",
                params: {
                  levelId,
                  levelType: levelData.type, // ✅ Pass level type
                  questions: 0, 
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
            }}
          />
        );

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