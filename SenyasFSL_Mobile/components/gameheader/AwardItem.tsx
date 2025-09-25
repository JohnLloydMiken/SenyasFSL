// src/components/AwardItem.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import type { Award, SvgProps } from "@/components/gameheader";

type SvgMap = Record<string, React.FC<SvgProps>>;

type Props = {
  award: Award;
  svgSize: number;
  svgMap: SvgMap;
  onPress: (award: Award) => void;
};

const AwardItem: React.FC<Props> = ({ award, svgSize, svgMap, onPress }) => {
  const SvgIcon = svgMap[award.AwardImage];

  return (
    <TouchableOpacity
      onPress={() => onPress(award)}
      className="w-1/3 mb-4 flex flex-col items-center"
      accessible
      accessibilityLabel={`Award: ${award.award_title}`}
      accessibilityHint="Tap to view award details"
    >
      {SvgIcon ? <SvgIcon width={svgSize} height={svgSize} /> : null}
      <Text className="text-center mt-2 text-sm font-medium" numberOfLines={2}>
        {award.award_title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(AwardItem);
