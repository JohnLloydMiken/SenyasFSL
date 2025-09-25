// src/components/FactItem.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import type { Fact, SvgProps } from "@/components/gameheader";


type SvgMap = Record<string, React.FC<SvgProps>>;

type Props = {
  fact: Fact;
  svgSize: number;
  svgMap: SvgMap;
  defaultUnlockedSvg: React.FC<SvgProps>;
  onPress: (fact: Fact) => void;
};

const FactItem: React.FC<Props> = ({ fact, svgSize, svgMap, defaultUnlockedSvg: PFD, onPress }) => {
  const SvgIcon = fact.unlocked ? PFD : svgMap[fact.image];

  return (
    <TouchableOpacity
      onPress={() => onPress(fact)}
      className="w-1/3 mb-4 flex flex-col items-center"
      accessible
      accessibilityLabel={`Fact: ${fact.Fact_title}`}
      accessibilityHint={fact.unlocked ? "Tap to read fact" : "Fact is locked"}
    >
      {SvgIcon ? <SvgIcon width={svgSize} height={svgSize} /> : null}
      <Text className="text-center mt-2 text-sm font-medium" numberOfLines={2}>
        {fact.Fact_title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(FactItem);
