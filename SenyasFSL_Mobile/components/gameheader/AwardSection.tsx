// src/components/AwardSection.tsx
import React, { useCallback } from "react";
import { View } from "react-native";
// Import the new ProcessedAchievement type from its source
import type { ProcessedAchievement } from "@/components/gameheader/AchievementScreen"; // Adjust path if needed
import type { SvgProps } from "@/components/gameheader";
import GradientText from "./GradientText";
import AwardItem from "./AwardItem";

type Props = {
  awards: ProcessedAchievement[]; // Use the new type
  unlockedCount: number;
  svgSize: number;
  lockedIcon: React.FC<SvgProps>; // Pass the locked icon component directly
  onItemPress: (item: ProcessedAchievement) => void; // Use the new type
};

const AwardSection: React.FC<Props> = ({
  awards,
  unlockedCount,
  svgSize,
  lockedIcon,
  onItemPress,
}) => {
  const handlePress = useCallback((award: ProcessedAchievement) => onItemPress(award), [onItemPress]);

  return (
    <View>
      <View className="ml-4 mt-4">
        <GradientText text={`Awards (${unlockedCount})`} />
      </View>

      <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
        {awards.map((a) => (
          <AwardItem
            key={a.id}
            award={a} // Pass the full ProcessedAchievement object
            svgSize={svgSize}
            lockedIcon={lockedIcon} // Pass the locked icon to the item
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(AwardSection);