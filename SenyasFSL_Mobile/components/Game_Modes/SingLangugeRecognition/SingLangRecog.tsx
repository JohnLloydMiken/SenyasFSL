import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import SignLangRecogWebView from "./SignLangRecogWebView";
import { useState } from "react";
import LevelContentBtn from "../GameBtns/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import { usePredictionStore } from "@/utils/store";
import { useVideoPlayer, VideoView } from "expo-video";
import { fslLetterMap } from "@/utils/assetsMap";
interface SingLangRecogProps {
  title: string;
  videoUrl: readonly string[];
  questions: readonly (readonly string[])[];
  correctAnswers: readonly string[];
  onPress: () => void;
}

const SingLangRecog: React.FC<SingLangRecogProps> = ({
  title,
  videoUrl,
  questions,
  correctAnswers,
  onPress,
}) => {
  const [count, setCount] = useState(0);
  const prediction = usePredictionStore((state) => state.prediction);
  const videoSource = fslLetterMap[videoUrl[count]];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.play();
  });
  useEffect(() => {
    if (prediction === correctAnswers[count]) {
      setCount((prev) => prev + 1);
    }
  }, [prediction]);
  return (
    <View className="flex-1 bg-white items-center justify-start gap-2">
      <Text className="font-PoppinsBold text-[1.75rem] md:text-4xl ">
        {title}
      </Text>
      {count < questions.length ? (
        <>
          <Text className="font-PoppinsSemiBold text-2xl md:text-3xl">
            {questions[count][0]}
          </Text>
          <Text className="font-PoppinsLightItalic text-xl md:text-3xl">
            “{questions[count][1]}”
          </Text>
          <View className="w-full h-1/4 relative -top-1">
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          </View>
        </>
      ) : (
        <Text className="font-PoppinsSemiBold text-2xl text-green-600">
          Done!
        </Text>
      )}

      <View className="w-11/12 h-96">
        <SignLangRecogWebView />
      </View>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {count < questions.length ? (
          <LevelContentBtn
            text="Skip"
            onPress={() => setCount((prev) => prev + 1)}
          />
        ) : (
          <LevelContentBtn text="Continue" onPress={onPress} />
        )}
      </View>
      <View className="absolute w-full bottom-0 z-10">
        <LevelBg />
      </View>
    </View>
  );
};

export default SingLangRecog;
