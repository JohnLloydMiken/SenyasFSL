import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { LevelConfig } from "@/modules/LevelContentConfig";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import ViewMC from "@/components/Game_Modes/VideoMC";
import FillTheGap from "@/components/Game_Modes/FillTheGap";
import BossFight from "@/components/Game_Modes/BossFight";
export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const steps = LevelConfig[levelId as keyof typeof LevelConfig] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const renderStep = () => {
    switch (step.type) {
      case "LearnASign": return <LearnASign {...step.data} onPress={() => setCurrentStep((prev) => prev + 1)}/>
      case "MultipleChoice": return <MultipleChoice {...step.data} onPress={() => setCurrentStep((prev) => prev + 1)}/>
      case "VideoMultipleChoice": return <ViewMC {...step.data} onPress={() => setCurrentStep((prev) => prev + 1)} />
      case "FillTheGap": return <FillTheGap {...step.data} onPress={() => setCurrentStep((prev) => prev + 1)}/>
      case "TrueOrFalse": return <TrueOrFalse {...step.data} onPress={() => setCurrentStep((prev) => prev + 1)}/>
      case "BossFight":  return <BossFight level={levelId}/>
    }
  };
  return renderStep();
}

const styles = StyleSheet.create({});
