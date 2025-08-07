import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn, { MCBTN } from "../LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import MCContent from "@/json_files/MutlipleChoiceContent.json";
import Inventory from "../Inventory";
import FTG_data from "@/json_files/FillTheGap.json";

const FillTheGap = () => {
  const source = FTG_data[0].FillNum1;
  const videoSource = videoMap[source.videoSource];
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });
  return (
    <View className="flex-1 relataive items-center">
      <Text className="font-PoppinsBold text-2xl md:text-3xl">
        {source.title}
      </Text>

      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View className={`bg-white/60 w-full p-4 absolute bottom-0  opacity-0`}>
          <Text className="text-sm text-center font-PoppinsRegular">
            {source.corrrectAnswer}
          </Text>
        </View>
      </View>

      <View className="w-11/12 rounded-md border border-[#F7D674] p-4 flex-col justify-center items-center">
        <Text className="text-center font-PoppinsSemiBold text-lg md:text-xl">{source.question}</Text>
        <View className="w-16 h-10 bg-gray-400"></View>
      </View>

      <View className="w-1/4 flex-row justify-center items-center gap-10 mt-2 ">
        {source.options.map((_, index)=> {
            return(
                <MCBTN
                key={index}
                EnglishText= {source.options[index]}
                FilipinoText=""
                hasChecked = {false}
                isCorrect = {false}
                isSelected = {false}
                onPress={()=>console.log("fef")}
                clicked = {false}
                />
            )
        })}
      </View>

    </View>
  );
};

const videoMap: Record<string, any> = {
  "FSL_A.mp4": require("@/assets/videos/FSL_A.mp4"),
};

export default FillTheGap;
