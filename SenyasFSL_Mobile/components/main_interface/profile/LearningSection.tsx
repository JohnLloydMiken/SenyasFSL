import React from "react";
import { View, Text } from "react-native";
import SectionItem from "./SectionItem";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onResetProgress: () => void;
}

export default function LearningSection({ onResetProgress }: Props) {
  return (
    <View className="w-11/12 max-w-md md:max-w-lg space-y-8">
      <View>
        <Text className="font-PoppinsBold text-lg md:text-xl mb-2 text-gray-800">
          Learning Progress
        </Text>
        <View className="flex flex-col space-y-2">
          {/* Add this SectionItem */}
          <SectionItem
            icon={require("@/assets/images/reset.png")}
            text="Reset all progress"
            onPress={onResetProgress} // Hook it up
          />
        </View>
      </View>
    </View>
  );
}
