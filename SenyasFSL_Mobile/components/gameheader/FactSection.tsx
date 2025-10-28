// src/components/gameheader/FactSection.tsx
import React, { useCallback } from "react";
import { View } from "react-native";
import type { ProcessedAchievement } from "./AchievementScreen"; // Import the new type
import type { SvgProps } from "@/components/gameheader";
import GradientText from "./GradientText";
import FactItem from "./FactItem"; // This component will also be updated

type Props = {
  facts: ProcessedAchievement[]; // Use the new type
  unlockedCount: number;
  svgSize: number;
  lockedIcon: React.FC<SvgProps>; // Pass the locked icon component
  onItemPress: (item: ProcessedAchievement) => void; // Use the new type
};

const FactSection: React.FC<Props> = ({
  facts,
  unlockedCount,
  svgSize,
  lockedIcon,
  onItemPress,
}) => {
  // This now just passes the 'fact' object, no 'type' needed
  const handlePress = useCallback((fact: ProcessedAchievement) => onItemPress(fact), [onItemPress]);

  return (
    <View>
      <View className="ml-4 mt-4">
        <GradientText text={`Facts (${unlockedCount})`} />
      </View>

      <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
        {facts.map((f) => (
          <FactItem
            key={f.id}
            fact={f} // Pass the full ProcessedAchievement object
            svgSize={svgSize}
            lockedIcon={lockedIcon} // Pass the locked icon to the item
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(FactSection);