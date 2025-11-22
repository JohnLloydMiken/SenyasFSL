// components/Game_Modes/FlowRenderer.tsx
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useCallback, useRef } from "react";
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import VideoMC from "@/components/Game_Modes/VideoMC";
import { LevelData } from "@/utils/store/levelData";
import Inventory from "../main_interface/treasure/Inventory";
import { useGameStore } from "@/hooks/useGameStore";
import { useGameProgressStore } from "@/hooks/useGameProgressStore";

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
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Zustand Game Store Integration ---
  const _setLevelData = useGameStore((state) => state._setLevelData);
  const _setPhase = useGameStore((state) => state._setPhase);
  const _setNextStep = useGameStore((state) => state._setNextStep);
  const clearGame = useGameStore((state) => state.clearGame);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);
  const setTotalSteps = LevelData((state) => state.setTotalSteps);
  
  // Accessors for values we will save/restore
  const isXpDoubledFromStore = useGameStore((s) => s.isXpDoubled);
  const is2xTryActiveFromStore = useGameStore((s) => s.is2xTryActive);
  const visibleChoicesFromStore = useGameStore((s) => s.visibleChoices);
  const phaseFromStore = useGameStore((s) => s.phase);

  const progress = useGameProgressStore();

  // Build level identifier. Prefer levelData.id if provided.
  const fullLevelId = levelData?.id ?? (typeof levelId === "string" ? levelId : undefined);

  // Use ref to track if we've loaded progress to avoid double-loading
  const hasLoadedProgress = useRef(false);

  // --- Load saved progress on mount ---
  useEffect(() => {
    let mounted = true;
    async function loadProgress() {
      if (!fullLevelId || hasLoadedProgress.current) return;
      
      hasLoadedProgress.current = true;

      try {
        const saved = await progress.load(fullLevelId);
        if (!mounted) return;

        if (saved) {
          console.log("[FlowRenderer] Loaded saved progress:", saved);

          // Restore step
          const restoredStep = typeof saved.currentStep === "number" ? saved.currentStep : 0;
          setCurrentStep(restoredStep);
          setLevelStep(restoredStep);

          // Restore visible choices (if included)
          if (saved.visibleChoices !== undefined) {
            setVisibleChoices(saved.visibleChoices);
          }

          // Restore phase (if included)
          if (saved.phase !== undefined) {
            _setPhase(saved.phase);
          }

          // Restore xp/item effects if included
          const toRestore: Partial<any> = {};
          if (saved.isXpDoubled !== undefined) toRestore.isXpDoubled = saved.isXpDoubled;
          if (saved.is2xTryActive !== undefined) toRestore.is2xTryActive = saved.is2xTryActive;
          if (Object.keys(toRestore).length > 0) {
            (useGameStore as any).setState(toRestore);
          }
        } else {
          // No saved state – ensure starting defaults
          setCurrentStep(0);
          setLevelStep(0);
          _setPhase("playing");
        }
      } catch (err) {
        console.warn("[FlowRenderer] Failed to load progress:", err);
      } finally {
        setIsInitialized(true);
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, [fullLevelId]); // Minimal dependencies

  // Async handler for next step with proper save handling
  const handleNextStep = useCallback(async () => {
    if (!fullLevelId) {
      // Fallback without save
      if (levelData && currentStep + 1 < levelData.flow.length) {
        setCurrentStep((prev) => {
          const next = prev + 1;
          setLevelStep(next);
          return next;
        });
      } else {
        router.push({
          pathname: "./Eval_phase",
          params: {
            levelId,
            levelType: levelData?.type, // ✅ Pass level type
            questions: levelData?.flow?.filter((f: any) => f.type === "question").length ?? 0,
            lessons: JSON.stringify(
              (levelData?.flow ?? [])
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
      return;
    }

    // If there are more steps, just advance and save will be triggered by effect below
    if (levelData && currentStep + 1 < levelData.flow.length) {
      setCurrentStep((prev) => {
        const next = prev + 1;
        setLevelStep(next);
        return next;
      });
      return;
    }

    // We're finishing the level: flush and remove saved state, then navigate
    try {
      const stateToSave = {
        currentStep: currentStep + 1,
        visibleChoices: visibleChoicesFromStore ?? null,
        phase: "completed",
        isXpDoubled: isXpDoubledFromStore ?? false,
        is2xTryActive: is2xTryActiveFromStore ?? false,
        lives: 0,
        tempScore: { xp: 0, senyasCoins: 0 },
      };
      // flush immediately
      await progress.flushSave(fullLevelId, stateToSave);
      // remove saved state because level is completed
      await progress.remove(fullLevelId);
    } catch (err) {
      console.warn("[FlowRenderer] Error flushing/removing save on finish:", err);
    } finally {
      // navigate to eval
      router.push({
        pathname: "./Eval_phase",
        params: {
          levelId,
          levelType: levelData?.type, // ✅ Pass level type
          questions: levelData?.flow?.filter((f: any) => f.type === "question").length ?? 0,
          lessons: JSON.stringify(
            (levelData?.flow ?? [])
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
  }, [
    fullLevelId,
    levelData,
    currentStep,
    progress,
    visibleChoicesFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    router,
    levelId,
    flowContent,
    setLevelStep,
  ]);

  // Setup the game store and next-step wiring once initialized
  useEffect(() => {
    if (!isInitialized) return;

    _setLevelData(levelData);
    _setPhase("playing");
    _setNextStep(() => {
      handleNextStep().catch((e) =>
        console.warn("[FlowRenderer] handleNextStep error:", e)
      );
    });
    if (levelData?.flow) {
      setTotalSteps(levelData.flow.length);
    }
    
    return () => {
      clearGame();
      _setLevelData(null);
    };
  }, [isInitialized, levelData?.id]); // Only re-run if initialized or levelData.id changes

  // Update visible choices when step changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const flowStep = levelData?.flow[currentStep];
    const content = flowStep ? flowContent.get(flowStep.ref) : null;
    if (content && content.options) {
      setVisibleChoices(content.options);
    } else {
      setVisibleChoices(null);
    }
    setLevelStep(currentStep);
  }, [currentStep, levelData, flowContent, setVisibleChoices, setLevelStep, isInitialized]);

  // --- Auto-save whenever important fields change ---
  useEffect(() => {
    if (!fullLevelId || !isInitialized) return;
    
    // Compose minimal save state
    const stateToSave = {
      currentStep,
      visibleChoices: visibleChoicesFromStore ?? null,
      phase: phaseFromStore ?? "playing",
      isXpDoubled: isXpDoubledFromStore ?? false,
      is2xTryActive: is2xTryActiveFromStore ?? false,
      lives: 0,
      tempScore: { xp: 0, senyasCoins: 0 },
    };
    
    // debounced save
    try {
      progress.save(fullLevelId, stateToSave);
    } catch (err) {
      console.warn("[FlowRenderer] progress.save failed:", err);
    }
  }, [
    fullLevelId,
    currentStep,
    visibleChoicesFromStore,
    phaseFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    progress,
    isInitialized,
  ]);

  // Cancel pending saves when unmounting
  useEffect(() => {
    return () => {
      progress.cancelPendingSaves?.();
    };
  }, [progress]);

  // --- Render Content ---
  if (!isInitialized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const flowStep = levelData?.flow[currentStep];
  const content = flowStep ? flowContent.get(flowStep.ref) : null;

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
        onPress={() => {
          handleNextStep().catch((e) =>
            console.warn("[FlowRenderer] lesson onPress error:", e)
          );
        }}
      />
    );
  }

  // QUESTION TYPE
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
          onPress={() => {
            handleNextStep().catch((e) =>
              console.warn("[FlowRenderer] MC onPress error:", e)
            );
          }}
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
          onPress={() => {
            handleNextStep().catch((e) =>
              console.warn("[FlowRenderer] Fill gap onPress error:", e)
            );
          }}
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
          onPress={() => {
            handleNextStep().catch((e) =>
              console.warn("[FlowRenderer] T/F onPress error:", e)
            );
          }}
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
          onPress={() => {
            handleNextStep().catch((e) =>
              console.warn("[FlowRenderer] VideoMC onPress error:", e)
            );
          }}
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

  return <View style={styles.container}>{QuestionComponent}</View>;
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