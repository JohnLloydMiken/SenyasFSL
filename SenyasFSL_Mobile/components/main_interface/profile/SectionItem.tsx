import React from "react";
import { TouchableOpacity, Image, Text, ImageSourcePropType } from "react-native";

interface Props {
  icon: ImageSourcePropType;
  text: string;
  onPress: () => void;
}

export default function SectionItem({ icon, text, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]"
    >
      <Image source={icon} />
      <Text className="text-[#242424] text-lg md:text-xl font-PoppinsSemiBold">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
