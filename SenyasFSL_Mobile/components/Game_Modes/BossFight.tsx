import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { shallow } from "zustand/shallow";

import Evaluation from "./Eval/Evaluation";
import OutOfHearts from "./Eval/OutOfHearts";
import BossFillTheGap from "./BossMode/BossFITG";
import BossMC from "./BossMode/BossMC";
import BossTrueOrFalse from "./BossMode/BossTF";
import BossVMC from "./BossMode/BossVMC";
import Instruction from "./BossMode";
import Inventory from "../main_interface/treasure/Inventory";
import { useGameStore, type GameStore } from "@/hooks/useGameStore";
import { useUserPoints } from "@/utils/store/userGameEval";
import { LevelData } from "@/utils/store/levelData";
import { useGameProgressStore } from "@/hooks/useGameProgressStore";

interface BossFightProps {
  levelData: any;
  flowContent: Map<string, any>;
}

const BossFight: React.FC<BossFightProps> = ({ levelData, flowContent }) => {
  const router = useRouter();
  const setTotalSteps = LevelData((state) => state.setTotalSteps);
  const setLevelStep = LevelData((state) => state.setLevelStep);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isInventoryClicked, setIsInventoryClicked] = useState(false);

  // Zustand store (type-safe + shallow)
  const _setLevelData = useGameStore((state) => state._setLevelData);
  const _setPhase = useGameStore((state) => state._setPhase);
  const _setNextStep = useGameStore((state) => state._setNextStep);
  const clearGame = useGameStore((state) => state.clearGame);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);

  // Accessors for values we will save/restore
  const isXpDoubledFromStore = useGameStore((s) => s.isXpDoubled);
  const is2xTryActiveFromStore = useGameStore((s) => s.is2xTryActive);
  const visibleChoicesFromStore = useGameStore((s) => s.visibleChoices);
  const phaseFromStore = useGameStore((s) => s.phase);

  const incrementScore = useUserPoints((state) => state.incrementScore);
  const resetScore = useUserPoints((state) => state.resetScore);

  const progress = useGameProgressStore();
  const fullLevelId = levelData?.id;

  // --- Load saved progress on mount ---
  useEffect(() => {
    let mounted = true;
    async function loadProgress() {
      if (!fullLevelId) return;

      try {
        const saved = await progress.load(fullLevelId);
        if (!mounted) return;

        if (saved) {
          console.log("[BossFight] Loaded saved progress:", saved);

          // Restore step
          const restoredStep = typeof saved.currentStep === "number" ? saved.currentStep : 0;
          setCurrentStep(restoredStep);
          setLevelStep(restoredStep);

          // Restore hearts and score (using lives as hearts)
          if (typeof saved.lives === "number") {
            setHearts(saved.lives);
          }
          if (saved.tempScore?.xp !== undefined) {
            setScore(saved.tempScore.xp);
          }

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

          // Always show instructions on resume (per requirement)
          setShowInstructions(true);
        } else {
          // No saved state – ensure starting defaults
          setCurrentStep(0);
          setLevelStep(0);
          setHearts(5);
          setScore(0);
          _setPhase("playing");
        }
      } catch (err) {
        console.warn("[BossFight] Failed to load progress:", err);
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, [fullLevelId, progress, setLevelStep, setVisibleChoices, _setPhase]);

  // --- Handlers ---
  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        setScore((s) => s + 1);
        incrementScore();
      } else {
        if (is2xTryActive) {
          useGameStore.setState({ is2xTryActive: false });
          return;
        }
        setHearts((h) => h - 1);
      }
    },
    [is2xTryActive, incrementScore]
  );

  const handleNextStep = useCallback(async () => {
    if (hearts <= 0) return;
    
    if (currentStep + 1 < steps.length) {
      setCurrentStep((s) => s + 1);
    } else {
      // Level completed - flush and remove saved state
      if (fullLevelId) {
        try {
          const stateToSave = {
            currentStep: currentStep + 1,
            visibleChoices: visibleChoicesFromStore ?? null,
            phase: "completed",
            isXpDoubled: isXpDoubledFromStore ?? false,
            is2xTryActive: is2xTryActiveFromStore ?? false,
            lives: hearts,
            tempScore: { xp: score, senyasCoins: 0 },
          };
          await progress.flushSave(fullLevelId, stateToSave);
          await progress.remove(fullLevelId);
        } catch (err) {
          console.warn("[BossFight] Error flushing/removing save on finish:", err);
        }
      }

      router.replace({
        pathname: "./Eval_phase",
        params: { levelId: levelData.id, questions: steps.length },
      });
    }
  }, [
    currentStep,
    levelData?.id,
    hearts,
    router,
    steps.length,
    fullLevelId,
    progress,
    visibleChoicesFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    score,
  ]);

  // Initialize game state
  useEffect(() => {
    if (!levelData) return;
    resetScore();
    _setLevelData(levelData);
    _setPhase("playing");
    _setNextStep(() => {
      handleNextStep().catch((e) =>
        console.warn("[BossFight] handleNextStep error:", e)
      );
    });

    return () => {
      clearGame();
      _setLevelData(null);
    };
  }, [levelData?.id, handleNextStep, resetScore, clearGame]);

  // Load question steps
  useEffect(() => {
    if (!levelData || !flowContent) return;

    const fetchSteps = () => {
      setLoading(true);
      try {
        const questionKeys = levelData?.questionPool || [];
        const fetchedQuestions = questionKeys
          .map((key: string) => flowContent.get(key))
          .filter(Boolean);

        fetchedQuestions.sort(() => Math.random() - 0.5);
        setSteps(fetchedQuestions);
        setTotalSteps(fetchedQuestions.length);
        if (fetchedQuestions.length > 0)
          setVisibleChoices(fetchedQuestions[0].options || []);
      } catch (e) {
        console.error("Failed to process questions:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, [levelData?.id, flowContent, setVisibleChoices]);

  useEffect(() => {
    setLevelStep(currentStep);
  }, [currentStep, setLevelStep]);

  useEffect(() => {
    if (steps[currentStep]) {
      setVisibleChoices(steps[currentStep].options || []);
    }
  }, [currentStep, steps, setVisibleChoices]);

  // --- Auto-save whenever important fields change ---
  useEffect(() => {
    if (!fullLevelId) return;
    if (showInstructions) return; // Don't save while showing instructions

    const stateToSave = {
      currentStep,
      visibleChoices: visibleChoicesFromStore ?? null,
      phase: phaseFromStore ?? "playing",
      isXpDoubled: isXpDoubledFromStore ?? false,
      is2xTryActive: is2xTryActiveFromStore ?? false,
      lives: hearts,
      tempScore: { xp: score, senyasCoins: 0 },
    };

    try {
      progress.save(fullLevelId, stateToSave);
    } catch (err) {
      console.warn("[BossFight] progress.save failed:", err);
    }
  }, [
    fullLevelId,
    currentStep,
    hearts,
    score,
    visibleChoicesFromStore,
    phaseFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    progress,
    showInstructions,
  ]);

  // Cancel pending saves when unmounting
  useEffect(() => {
    return () => {
      progress.cancelPendingSaves?.();
    };
  }, [progress]);

  // --- Render Logic ---
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const step = steps[currentStep];

  if (showInstructions) {
    return (
      <Instruction
        data={levelData.introduction}
        onPress={() => {
          if (steps.length > 0) setShowInstructions(false);
          else alert("No questions available for this boss fight.");
        }}
      />
    );
  }

  if (hearts <= 0 && !showInstructions) {
    return (
      <OutOfHearts
        onRetake={async () => {
          // Reset to initial state and clear saved progress
          setHearts(5);
          setScore(0);
          setCurrentStep(0);
          resetScore();
          setShowInstructions(true);
          
          if (fullLevelId) {
            try {
              await progress.remove(fullLevelId);
            } catch (err) {
              console.warn("[BossFight] Failed to remove save on retake:", err);
            }
          }
        }}
        onContinue={() => router.push("../")}
      />
    );
  }

  const renderStep = () => {
    if (!step) {
      return (
        <View style={styles.center}>
          <Text>Loading results...</Text>
        </View>
      );
    }

    const commonProps = {
      enPrompt: step.enPrompt,
      filPrompt: step.filPrompt,
      options: step.options,
      videoURL: step.videoUrl,
      onAnswer: handleAnswer,
      onPress: () => {
        handleNextStep().catch((e) =>
          console.warn("[BossFight] onPress error:", e)
        );
      },
      hearts,
    };

    switch (step.type?.toLowerCase()) {
      case "fill_in_the_gap":
        return <BossFillTheGap {...commonProps} key={step.id} />;
      case "multiple_choice":
        return <BossMC {...commonProps} key={step.id} />;
      case "true_or_false":
        return <BossTrueOrFalse {...commonProps} key={step.id} />;
      case "multiple_choice_video":
        return <BossVMC {...commonProps} key={step.id} />;
      default:
        return (
          <View style={styles.center}>
            <Text>Unknown question type: {step.type}</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 16,
    zIndex: 50,
  },
});

export default BossFight;