import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useLocalSearchParams } from "expo-router";
import LevelContentBtn, {
  MultipleChoiceBTN,
} from "@/components/LevelContentBtn";
export default function LevelContent() {
  const [isClicked, setIsClicked] = useState(false);
  const videoSource = require("@/assets/videos/FSL_A.mp4");
  const { levelId } = useLocalSearchParams();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.pause();
  });
  return (
    <View className="flex-1  relative bg-white">
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold my-2">Learn A New Sign</Text>
      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </View>

      <View className="w-11/12 mx-auto">
        <MultipleChoiceBTN
          EnglishText="Letter A"
          FilipinoText= {`"Letrang A"`}
          onPress={() => {
            player.play();
            setIsClicked(!isClicked);

            if(isClicked){
              player.pause()
            }
          }}
          clicked={isClicked}
        />
      </View>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50">
        <LevelContentBtn text="Next" onPress={() => console.log("fwfewf")} />
      </View>

      <View className="absolute w-full bottom-0 z-10">
        <LevelBg />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
