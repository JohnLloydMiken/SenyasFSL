import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { LevelConfig } from "@/modules/LevelContentConfig";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
import ViewMC from "@/components/Game_Modes/VideoMC";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  const  steps = LevelConfig[levelId as keyof typeof LevelConfig] || [];
   const [currentStep, setCurrentStep] = useState(0);
    const step = steps[currentStep]

   const renderStep= ()=>{
    switch(step.type){
      case "LearnASign": 
      return (
        <LearnASign 
        title={step.data.title}
        videoUrl={step.data.videoUrl}
        EnglishText={step.data.EnglishText}
        FilipinoText= {step.data.FilipinoText}
        onPress={()=> setCurrentStep(prev => prev+1)}/>
      )
      case "MultipleChoice" : 
      return (
        <MultipleChoice 
        title={step.data.title}
        videoUrl= {step.data.videoUrl}
        choices={step.data.choices}
        correctAnswer={step.data.correctAnswer}
        onPress={()=>console.log("dwqd")}/>
      )
    }
   } 
  return renderStep()
}

const styles = StyleSheet.create({});
