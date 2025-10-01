import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TryAgain from "@/assets/svgs/tryagain 1.svg";
import { fslIconSize } from "@/utils/sizes";

interface OutOfHeartsProps {
  onContinue: () => void;
  onRetake: () => void;
}

const OutOfHearts: React.FC<OutOfHeartsProps> = ({ onContinue, onRetake }) => {
  return (
    <View className="flex-1 bg-white items-center justify-start gap-5">
      <Text className="text-[#F70509] text-5xl md:text-6xl font-PoppinsBold mb-4">
        Run out of Hearts
      </Text>
      <Text className="font-PoppinsBold text-2xl md:text-4xl">
        Keep Trying Senyas Warrior!
      </Text>
      <Text className="font-PoppinsSemiBold text-xl md:text-2xl">
        You can do it, never give up!
      </Text>
      <TryAgain width={fslIconSize()} height={fslIconSize()} />

      <View className="w-11/12 gap-8 absolute bottom-8">
        <TouchableOpacity className=" w-full bg-[#F70509] p-4 rounded-lg" onPress={onRetake}>
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
            Try Again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full"
          onPress={onContinue}
        >
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#626262]">
            Maybe next time
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutOfHearts;
