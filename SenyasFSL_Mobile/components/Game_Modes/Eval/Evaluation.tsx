import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import FSL_Great from "@/assets/svgs/FSL_Great.svg";
import { useUserPoints } from "@/utils/store/userGameEval";
interface EvaluationProps {
  percent: number;
  xp: number;
  coins: number;
  onContinue: () => void;
  onRetake: () => void;
}

const Evaluation: React.FC<EvaluationProps> = ({
  percent,
  xp,
  coins,
  onContinue,
  onRetake,
}) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 350 : 500;
  const resetScore = useUserPoints((state) => state.resetScore);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex-1 items-center justify-start bg-white relative mt-16">
        <View className="w-full flex-col justify-center items-center">
          <Text className="text-[#31F705] font-PoppinsBold text-7xl md:text-5xl">
            {percent}%
          </Text>
          <Text className="text-xl md:text-2xl font-PoppinsBold">
            Great Job!
          </Text>
          <Text className="text-lg md:text-xl font-PoppinsRegular">
            You completed the lesson.
          </Text>
        </View>

        <FSL_Great width={svgSize} height={svgSize} />

        {/* Rewards Section */}
        <View className="mt-4 w-10/12 bg-white border border-gray-200 rounded-2xl p-5 items-center shadow-sm">
          <Text className="text-3xl font-PoppinsBold text-yellow-500">
            {coins}
          </Text>
          <Text className="font-PoppinsRegular text-gray-500">
            SenyasCoins
          </Text>

          <Text className="mt-2 text-xl font-PoppinsBold text-orange-500">
            +{xp} EXP
          </Text>
        </View>

        <View className="w-11/12 gap-8 absolute bottom-8">
          <TouchableOpacity
            className="w-full bg-[#27D700] p-4 rounded-lg"
            onPress={onContinue}
          >
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
              Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full"
            onPress={() => {
              onRetake();
              resetScore();
            }}
          >
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#626262]">
              Retake Lesson
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Evaluation;