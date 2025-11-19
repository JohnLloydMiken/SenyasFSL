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

interface BossFightProps {
  levelData: any;
  flowContent: Map<string, any>;
}

const BossFight: React.FC<BossFightProps> = ({ levelData, flowContent }) => {
  const router = useRouter();

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

  const incrementScore = useUserPoints((state) => state.incrementScore);
  const resetScore = useUserPoints((state) => state.resetScore);

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

  const handleNextStep = useCallback(() => {
    if (hearts <= 0) return;
    if (currentStep + 1 < steps.length) {
      setCurrentStep((s) => s + 1);
    } else {
      router.replace({
        pathname: "./Eval_phase",
        params: { levelId: levelData.id, questions: steps.length },
      });
    }
  }, [currentStep, levelData?.id, hearts, router, steps.length]);

  // Initialize game state
  useEffect(() => {
    if (!levelData) return;
    resetScore();
    _setLevelData(levelData);
    _setPhase("playing");
    _setNextStep(handleNextStep);

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
    if (steps[currentStep]) {
      setVisibleChoices(steps[currentStep].options || []);
    }
  }, [currentStep, steps, setVisibleChoices]);

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
        onRetake={() => {
          setHearts(5);
          setScore(0);
          setCurrentStep(0);
          resetScore();
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
      onPress: handleNextStep,
      hearts,
    };

    switch (step.type?.toLowerCase()) {
      case "fill_in_the_gap":
        return <BossFillTheGap {...commonProps} key= {step.id}  />;
      case "multiple_choice":
        return <BossMC {...commonProps} key= {step.id} />;
      case "true_or_false":
        return <BossTrueOrFalse {...commonProps} key= {step.id} />;
      case "multiple_choice_video":
        return <BossVMC {...commonProps} key= {step.id} />;
      default:
        return (
          <View style={styles.center}>
            <Text>Unknown question type: {step.type}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
    </View>
  );
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
