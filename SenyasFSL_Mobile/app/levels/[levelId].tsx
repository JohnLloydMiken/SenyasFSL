import { StyleSheet, Text, View, TouchableOpacity} from "react-native";
import LevelBg from '@/assets/svgs/LevelBG.svg'
import React from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useLocalSearchParams } from "expo-router";

export default function LevelContent() {
  const videoSource = require("@/assets/videos/FSL_A.mp4");
  const { levelId } = useLocalSearchParams();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.pause()
  });
  return (
    <View className="flex-1 ">
      <View className="w-full h-[30%] relative -top-1 ">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </View>

        <TouchableOpacity className="w-11/12 rounded-full p-4  mx-auto my-2 border border-[#F7D674]" onPress={()=> player.play()}>
          <Text className="text-center">Letter A</Text>
        </TouchableOpacity>

        <View className="absolute w-full bottom-0">
          <LevelBg/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({});
