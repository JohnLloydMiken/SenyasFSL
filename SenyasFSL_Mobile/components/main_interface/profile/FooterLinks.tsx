import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function FooterLinks() {
  return (
    <View className="w-full bg-[#F4E6C1] p-4 flex flex-col ">
      {["Imprint", "Terms and Conditions", "Privacy Policy"].map((item, idx) => (
        <TouchableOpacity
          key={idx}
          className="w-full p-2 border-b-2 border-b-[#CCB066]"
        >
          <Text className="text-sm md:text-lg font-PoppinsRegular text-[#525252]">
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <View className="relative bottom-0 mx-auto mt-10">
        <Text className="text-xs md:text-sm text-[#7A7A7A] text-center">
          Version 1
        </Text>
        <Text className="text-xs md:text-sm text-[#7A7A7A] text-center">
          @ SenyasFSL 2025
        </Text>
      </View>
    </View>
  );
}
