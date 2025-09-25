// src/components/AwardSection.tsx
import React, { useCallback } from "react";
import { View } from "react-native";
import type { Award, SvgProps, ItemType } from "@/components/gameheader";
import GradientText from "./GradientText";
import AwardItem from "./AwardItem";

type SvgMap = Record<string, React.FC<SvgProps>>;

type Props = {
  awards: Award[];
  unlockedCount: number;
  svgSize: number;
  svgMap: SvgMap;
  onItemPress: (item: Award, type: ItemType) => void;
};

const AwardSection: React.FC<Props> = ({ awards, unlockedCount, svgSize, svgMap, onItemPress }) => {
  const handlePress = useCallback((award: Award) => onItemPress(award, "award"), [onItemPress]);

  return (
    <View>
      <View className="ml-4 mt-4">
        <GradientText text={`Awards (${unlockedCount})`} />
      </View>

      <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
        {awards.map((a) => (
          <AwardItem key={a.id} award={a} svgSize={svgSize} svgMap={svgMap} onPress={handlePress} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(AwardSection);
