import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
interface ButtonProps {
  text: string;
  onPress: () => void;
}
interface MultipleChoiceBTNnProps {
  EnglishText: string;
  FilipinoText: string;
  clicked: boolean;
    isChecked: boolean;
  isCorrect: boolean | null; // true, false, or null
  onPress: () => void;
}
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
const LevelContentBtn: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: "100%",
        borderRadius: 50,
        backgroundColor: "trasnparent",
        elevation: 5,
      }}
    >
      {/* Invisible text only to preserve size */}
      <TouchableOpacity onPress={onPress} className="p-4">
        <Text className="font-PoppinsBold text-xl md:text-2xl text-center text-white">
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const MultipleChoiceBTN: React.FC<MultipleChoiceBTNnProps> = ({
  EnglishText,
  FilipinoText,
  onPress,
  clicked,
  isChecked,
  isCorrect,
}) => {
  // Decide gradient colors
  let gradientColors = ["#eee", "#eee"]; // default (won’t be shown)
  let showGradient = false;

  if (isChecked) {
    if (isCorrect === true) {
      gradientColors = ["#3FBF5A", "#0F9D58"]; // green for correct
      showGradient = true;
    } else if (isCorrect === false && clicked) {
      gradientColors = ["#F44336", "#B71C1C"]; // red for incorrect
      showGradient = true;
    }
  } else if (clicked) {
    gradientColors = ["#FB990F", "#EA0505"]; // orange/red when just selected
    showGradient = true;
  }

  const content = (
    <View className="bg-white rounded-full w-full p-2">
      {/* English Text */}
      <MaskedView
        maskElement={
          <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
            {EnglishText}
          </Text>
        }
      >
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}>
          <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center opacity-0">
            {EnglishText}
          </Text>
        </LinearGradient>
      </MaskedView>

      {/* Filipino Text */}
      <MaskedView
        maskElement={
          <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
            {FilipinoText}
          </Text>
        }
      >
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}>
          <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] opacity-0">
            {FilipinoText}
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );

  return showGradient ? (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: "100%",
        borderRadius: 50,
        padding: 1,
        marginTop: 10,
        marginBottom: 10,
        elevation: 5,
      }}
    >
      <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
    </LinearGradient>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      className="w-full p-2 border border-[#F7D674] rounded-full my-3"
    >
      <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
        {EnglishText}
      </Text>
      <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
        {FilipinoText}
      </Text>
    </TouchableOpacity>
  );
};


export default LevelContentBtn;
