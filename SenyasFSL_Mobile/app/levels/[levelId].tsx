import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import React, { useState } from "react";
import LearnASign from "@/components/Game_Modes/LearnASign";
import MultipleChoice from "@/components/Game_Modes/MultipleChoice";
export default function LevelContent() {
 
  return (
    <View className="flex-1  relative bg-white">
        <MultipleChoice 
        videoUrl={require('@/assets/videos/FSL_A.mp4')}  
        title="Choice the right Sign"
        correctAnswer="Letter A"
        optionOne="Letter A"
        optionOneFil="Letrang A"
        optoptionTwo="Letter B"
        optionTwoFil="Letrang B"
        />
        
      
    </View>
  );
}

const styles = StyleSheet.create({});
