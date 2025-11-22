import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TryAgain from "@/assets/svgs/tryagain 1.svg";
import { fslIconSize } from "@/utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
interface FailedLevelProps {
  onRetake: () => void;
  onNext: () => void;
}

const FailedLevel: React.FC<FailedLevelProps> = ({ onNext, onRetake }) => {
  return (
    <SafeAreaView style={{flex:1, padding:16, backgroundColor: "white"}}>
      <View className="flex-1 bg-white items-center">
        <Text className="text-5xl text-center font-PoppinsBold md:text-4xl text-red-500">
          Score Too Low
        </Text>
        <Text className="text-center text-xl font-PoppinsRegular my-2">
          Keep Practicing!
        </Text>
        <Text className="text-center text-lg font-PoppinsRegular">
          Almost there! Go over the lesson once more and give it another shot.
         
        </Text>
         <TryAgain width={fslIconSize()} height={fslIconSize()} />
        <View className="w-11/12 gap-8 absolute bottom-8">
          <TouchableOpacity
            className=" w-full bg-[#F70509] p-4 rounded-lg"
            onPress={onRetake}
          >
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
              Try Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full" onPress={onNext}>
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#626262]">
              Maybe next time
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FailedLevel;
