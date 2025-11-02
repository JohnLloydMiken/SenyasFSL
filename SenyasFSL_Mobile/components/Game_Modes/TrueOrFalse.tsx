import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import MCBTN from "./GameBtns/MCBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import Inventory from "../main_interface/treasure/Inventory";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import { videoSpeed } from "@/utils/store/videoSpeed";

// ✅ --- IMPORTS FOR RETRY ---
import { useGameStore } from "@/hooks/useGameStore";
import Toast from "react-native-toast-message";

// --- Interfaces ---
export interface TrueFalseOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
}

interface TrueOrFalseProps {
  enQuestion: string;
  filQuestion: string;
  videoURL: string;
  options: readonly TrueFalseOption[];
  onPress: () => void;
}

const TrueOrFalse: React.FC<TrueOrFalseProps> = ({
  enQuestion,
  filQuestion,
  videoURL,
  options,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null); // stores option id
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const speed = videoSpeed((state) => state.playingSpeed);
  const incrementScore = useUserPoints((state) => state.incrementScore);

  // ✅ --- GAME STORE STATE (RETRY) ---
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  const correctAnswer = useMemo(() => {
    const correctOpt = options.find((opt) => !opt.isCorrect);
    return correctOpt ? correctOpt.labelEn : "";
  }, [options]);

  // Create video player
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Fetch and resolve video URL
  useEffect(() => {
    const loadVideo = async () => {
      try {
        let finalUrl = videoURL;
        if (videoURL.startsWith("gs://")) {
          finalUrl = await getVideoUrl(videoURL);
        }
        setResolvedUrl(finalUrl);
        player.replace(finalUrl);
        player.play();
        player.playbackRate = speed;
      } catch (error) {
        console.error("Error loading video URL:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [videoURL]);

  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]);

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY) ---
  const handleCheck = useCallback(() => {
    if (!selectedChoice) return;

    const selectedOption = options.find((opt) => opt.id === selectedChoice);
    // Note: Original logic for TF is inverted
    const isAnswerCorrect = selectedOption ? !selectedOption.isCorrect : false;

    if (isAnswerCorrect) {
      // --- CORRECT ANSWER ---
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
      setOpacity(0);
    } else {
      // --- INCORRECT ANSWER ---
      if (is2xTryActive) {
        // --- 2xTRY IS ACTIVE ---
        consume2xTry();
        Toast.show({
          type: "info",
          text1: "Saved by 2x Try!",
          text2: "That was incorrect, try again!",
        });
        setSelectedChoice(null); // Reset choice
      } else {
        // --- 2xTRY IS NOT ACTIVE ---
        setIsCorrect(false);
        setHasChecked(true);
        setOpacity(0);
      }
    }
  }, [
    selectedChoice,
    options,
    incrementScore,
    is2xTryActive,
    consume2xTry,
  ]);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center text-gray-400 mt-8">
          Loading videos...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative items-center bg-white">
      <View className="w-10/12">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          {filQuestion}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          {enQuestion}
        </Text>
      </View>

      <View className="w-full h-56 flex-row items-center justify-center">
        <View className="w-full h-full">
          <VideoView
            style={{ width: "100%", height: "100%" }}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        </View>
      </View>

      <View className="w-11/12 mx-auto">
        {options.map((option) => (
          <MCBTN
            key={option.id}
            EnglishText={option.labelEn}
            FilipinoText={`"${option.labelFil}"`}
            onPress={() => !hasChecked && setSelectedChoice(option.id)}
            clicked={hasChecked}
            isCorrect={!option.isCorrect} // Original inverted logic
            isSelected={selectedChoice === option.id}
            hasChecked={hasChecked}
            rounded={50}
          />
        ))}
      </View>

       <View
        style={{ opacity }}
        className="w-full p-4 mx-auto absolute bottom-28 z-50"
      >
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View> 

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect !== null && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            {isCorrect ? <CorrectIcon /> : <Incorrect />}
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              {isCorrect ? "Correct!" : "Incorrect!"}
            </Text>
          </View>
        )}

        {selectedChoice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleCheck} />
        ) : hasChecked ? (
          <LevelContentBtn text="Next" onPress={onPress} />
        ) : null}
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

export default TrueOrFalse;