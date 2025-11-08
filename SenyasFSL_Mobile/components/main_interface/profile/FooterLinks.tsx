import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// --- START: Add props interface ---
interface Props {
  onPressAbout: () => void;
  onPressTerms: () => void;
  onPressPrivacy: () => void;
}
// --- END: Add props interface ---

// --- START: Update component signature to accept props ---
export default function FooterLinks({
  onPressAbout,
  onPressTerms,
  onPressPrivacy,
}: Props) {
// --- END: Update component signature ---

  const getHandler = (label: string) => {
    switch (label) {
      case "About":
        return onPressAbout;
      case "Terms and Conditions":
        return onPressTerms;
      case "Privacy Policy":
        return onPressPrivacy;
      default:
        return () => {}; // No-op
    }
  };

  return (
    <View className="w-full bg-[#F4E6C1] p-4 flex flex-col ">
      {["About", "Terms and Conditions", "Privacy Policy"].map((item, idx) => (
        // --- START: Add onPress prop ---
        <TouchableOpacity
          key={idx}
          className="w-full p-2 border-b-2 border-b-[#CCB066]"
          onPress={getHandler(item)} // Attach the correct handler
        >
        {/* --- END: Add onPress prop --- */}
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