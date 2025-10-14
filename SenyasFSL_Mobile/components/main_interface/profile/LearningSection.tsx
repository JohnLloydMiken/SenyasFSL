import React from "react";
import { View, Text } from "react-native";
import SectionItem from "./SectionItem";

interface Props {
  onPressEdit: () => void;
}

export default function LearningSection({ onPressEdit }: Props) {
  return (
    <View className="w-11/12 my-8">
      <Text className="font-PoppinsBold text-[#3C3C3C] text-xl md:text-2xl mb-2">
        Learning progress
      </Text>
      <SectionItem
        icon={require("@/assets/images/reset.png")}
        text="Edit personal data"
        onPress={onPressEdit}
      />
    </View>
  );
}
