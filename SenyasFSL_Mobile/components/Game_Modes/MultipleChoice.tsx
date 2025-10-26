import { View, Text } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import MCBTN from "./GameBtns/MCBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import Inventory from "../main_interface/Inventory";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import { videoSpeed } from "@/utils/store/videoSpeed";
interface Option {
  id: string;
  labelEn: string;
  labelFil: string;
  isCorrect: boolean;
}

interface MultipleChoiceProps {
  enPrompt: string;
  filPrompt: string;
  videoUrl: string;
  options: Option[];
  onPress: () => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  enPrompt,
  filPrompt,
  videoUrl,
  options,
  onPress,
}) => {
  const [choice, setChoice] = useState<Option | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);
  // Initialize player (empty source first)
  const player = useVideoPlayer("", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // ✅ Load and update video
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        let finalUrl = videoUrl;

        if (videoUrl.startsWith("gs://")) {
          finalUrl = await getVideoUrl(videoUrl);
        }
        setResolvedUrl(finalUrl);
        player.replace(finalUrl);
        player.play();
        player.playbackRate = speed;
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoUrl]);

  useEffect(() => {
      if (player) {
        player.playbackRate = speed;
      }
    }, [speed, player]); // Dependencies: speed and player

  // ✅ Handle check button
  const handleCheck = useCallback(() => {
    if (!choice) return;
    if (choice.isCorrect) {
      incrementScore(); // Add a point only if correct
    }
    setIsCorrect(choice.isCorrect);
    setHasChecked(true);
  }, [choice]);

  // ✅ Render options efficiently
  const renderOptions = useMemo(
    () =>
      options.map((item) => (
        <MCBTN
          key={item.id}
          EnglishText={item.labelEn}
          FilipinoText={item.labelFil}
          onPress={() => {
            if (!hasChecked) setChoice(item);
          }}
          clicked={hasChecked}
          isCorrect={item.isCorrect}
          isSelected={choice?.id === item.id}
          hasChecked={hasChecked}
          rounded={50}
        />
      )),
    [options, choice, hasChecked]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center mt-8 text-gray-400">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white">
      {/* PROMPTS */}
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold my-2">
        {enPrompt}
      </Text>
      <Text className="text-center text-xl md:text-2xl font-PoppinsLightItalic my-2">
        {filPrompt}
      </Text>

      {/* VIDEO */}
      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </View>

      {/* MULTIPLE CHOICE OPTIONS */}
      <View className="w-11/12 mx-auto mt-4">{renderOptions}</View>

      {/* INVENTORY */}
      <View className="w-full p-4 mx-auto absolute bottom-20 z-50">
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* RESULT + BUTTONS */}
      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect !== null && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            {isCorrect ? <CorrectIcon /> : <Incorrect />}
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              {isCorrect ? "Correct!" : "Incorrect!"}
            </Text>
          </View>
        )}

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleCheck} />
        ) : (
          hasChecked && <LevelContentBtn text="Next" onPress={onPress} />
        )}
      </View>

      {/* BACKGROUND STATE */}
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

export default React.memo(MultipleChoice);
