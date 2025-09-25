// src/components/GradientText.tsx
import React from "react";
import { Text, TextStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  text: string;
  className?: string;
  style?: TextStyle;
};

const GradientText: React.FC<Props> = ({ text, className, style }) => {
  return (
    <MaskedView
      maskElement={
        <Text className={className ?? "text-2xl md:text-3xl font-PoppinsBold"} style={style}>
          {text}
        </Text>
      }
    >
      <LinearGradient colors={["#FB990F", "#EA0505"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[{ opacity: 0 }, style]}
          className={className ?? "text-2xl md:text-3xl font-PoppinsBold"}
        >
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default React.memo(GradientText);
