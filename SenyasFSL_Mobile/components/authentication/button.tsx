import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";
import React from "react";

type BtnProps = {
  content: string;
  onPress?: (event: GestureResponderEvent) => void;
};
const Authbutton: React.FC<BtnProps> = ({ content, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full p-4 md:p-6 bg-[#FB990F] rounded-md my-4"
    >
      <Text className="text-white font-PoppinsBold text-center text-2xl md:text-3xl">
        {content}
      </Text>
    </TouchableOpacity>
  );
};

export default Authbutton;
