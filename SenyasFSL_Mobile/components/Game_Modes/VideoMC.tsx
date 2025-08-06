import { View, Text } from "react-native";
import React, { useState } from "react";
import VideoMC from "@/json_files/VideoMC.json";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import  { VideoMCBTN } from "../LevelContentBtn";
const ViewMC = () => {
  const source = VideoMC[0];
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  return (
    <View className="flex-1 relative items-center">
      <Text className="text-center font-PoppinsBold my-2 text-2xl md:text-3xl">
        {source.VideoMCNum1.title}
      </Text>

      <View className="w-11/12">
      <VideoMCBTN 
      answer={source.VideoMCNum1.correctAnswer}
      isCorrect ={false}
      hasChecked ={false}
      clicked = {false}
      isSelected = {false}
      onPress={()=> console.log("")}
      videoSource={source.VideoMCNum1.videoSource1}
      />
      </View>

      <View className="absolute w-full bottom-0 z-10">
        {isCorrect === true ? (
          <CorrectBG />
        ) : isCorrect === false ? (
          <WrongBG />
        ) : (
          <LevelBg />
        )}
      </View>
    </View>
  );
};

export default ViewMC;
