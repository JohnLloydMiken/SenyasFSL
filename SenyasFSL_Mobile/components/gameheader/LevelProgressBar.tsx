import React from "react";
import { View, StyleSheet } from "react-native";
import { LevelData } from "@/utils/store/levelData";

const LevelProgressBar = () => {
  const levelStep = LevelData((state) => state.levelStep);
  const totalSteps = LevelData((state) => state.totalSteps);

  // Calculate percentage (clamp between 0 and 100)
  const progress = Math.min(Math.max((levelStep / totalSteps) * 100, 0), 100);

  return (
    // Outer Container (The track)
    <View className="w-11/12 h-6 rounded-2xl bg-[#FFEEB9] mx-auto overflow-hidden border-2 border-transparent">
      {/* Inner Bar (The fill) */}
      <View 
        style={{ width: `${progress}%` }} 
        className="h-full bg-[#FB990F] rounded-2xl" 
      />
    </View>
  );
};

export default LevelProgressBar;