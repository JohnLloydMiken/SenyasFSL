// src/components/FactSection.tsx
import React, { useCallback } from "react";
import { View } from "react-native";
import type { Fact, SvgProps, ItemType } from "@/components/gameheader";
import GradientText from "./GradientText";
import FactItem from "./FactItem";

type SvgMap = Record<string, React.FC<SvgProps>>;

type Props = {
  facts: Fact[];
  unlockedCount: number;
  svgSize: number;
  svgMap: SvgMap;
  defaultUnlockedSvg: React.FC<SvgProps>;
  onItemPress: (item: Fact, type: ItemType) => void;
};

const FactSection: React.FC<Props> = ({ facts, unlockedCount, svgSize, svgMap, defaultUnlockedSvg, onItemPress }) => {
  const handlePress = useCallback((fact: Fact) => onItemPress(fact, "fact"), [onItemPress]);

  return (
    <View className="mt-6">
      <View className="ml-4 mt-4">
        <GradientText text={`Facts (${unlockedCount})`} />
      </View>

      <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4 pb-6">
        {facts.map((f) => (
          <FactItem
            key={f.id}
            fact={f}
            svgSize={svgSize}
            svgMap={svgMap}
            defaultUnlockedSvg={defaultUnlockedSvg}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(FactSection);
