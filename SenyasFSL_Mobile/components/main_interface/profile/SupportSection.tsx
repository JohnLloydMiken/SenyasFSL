import React from "react";
import { View, Text } from "react-native";
import SectionItem from "./SectionItem";

interface Props {
  onPressHelp: () => void;
}

export default function SupportSection({ onPressHelp }: Props) {
  return (
    <View className="w-11/12 mb-8">
      <Text className="font-PoppinsBold text-[#3C3C3C] md:text-2xl text-xl mb-2">
        Support
      </Text>
      <SectionItem
        icon={require("@/assets/images/help.png")}
        text="Help"
        onPress={onPressHelp}
      />
    </View>
  );
}