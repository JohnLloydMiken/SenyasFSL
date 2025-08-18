import { View, Text, useWindowDimensions , TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import FSL_Great from "@/assets/svgs/FSL_Great.svg";

interface EvaluationProps {
  percent: number;
  onContinue: () => void
  onRetake: () => void
}

const Evaluation: React.FC<EvaluationProps> = ({ percent, onContinue, onRetake }) => {
    const {width} = useWindowDimensions()
    const svgSize = width < 768 ? 350 : 500
  return (
   <SafeAreaView style ={{flex: 1 , backgroundColor: 'white'}}>
     <View className="flex-1 items-center justify-start bg-white relative mt-16">
      <View className="w-full  flex-col justify-center items-center ">
        <Text className="text-[#31F705] font-PoppinsBold text-7xl md:text-5xl">{percent}%</Text>
        <Text className="text-xl md:text-2xl font-PoppinsBold">Great Job!</Text>
        <Text className="text-lg md:text-xl font-PoppinsRegular">You completed the lesson.</Text>
      </View>
      <FSL_Great width={svgSize} height={svgSize}/>

      <View className="w-11/12 gap-8 absolute bottom-8">
        <TouchableOpacity className="w-full bg-[#27D700] p-4 rounded-lg" onPress={onContinue}>
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">Continue</Text>
        </TouchableOpacity>
         <TouchableOpacity className="w-full" onPress={onRetake}>
            <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#626262]">Retake Lesson</Text>
        </TouchableOpacity>
      </View>
    </View>
   </SafeAreaView>
  );
};

export default Evaluation;
