import { View, Text, ScrollView } from "react-native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "@/components/Game_Modes/GameBtns/LevelContentBtn";
import MCBTN from "@/components/Game_Modes/GameBtns/MCBTN";
import Inventory from "@/components/main_interface/treasure/Inventory";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import FSL_Fight from "@/assets/svgs/FSL_Fight.svg";
import FSL_Wrong from "@/assets/svgs/FSL_wrong.svg";
import { videoSpeed } from "@/utils/store/videoSpeed";
import { useGameStore } from "@/hooks/useGameStore";
import { QuestionOption as SharedQuestionOption } from "@/shared/types/index";
import Toast from "react-native-toast-message";
import { useAnswerSounds } from "@/hooks/useAnswerSounds";

// --- Interfaces ---
export interface TrueFalseOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
}

interface TrueOrFalseProps {
  enPrompt: string;
  filPrompt: string;
  videoURL: string;
  options: readonly TrueFalseOption[];
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossTrueOrFalse: React.FC<TrueOrFalseProps> = ({
  enPrompt,
  filPrompt,
  videoURL,
  options,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWrongIcon, setShowWrongIcon] = useState(false);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);

  // Game store state
  const visibleChoices = useGameStore((state) => state.visibleChoices);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // Sound hook
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // Correct answer (inverted logic)
  const correctAnswer = useMemo(() => {
    const correctOpt = options.find((opt) => !opt.isCorrect);
    return correctOpt ? correctOpt.labelEn : "";
  }, [options]);

  // Create video player
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Fetch video
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

  // Wrong icon effect
  useEffect(() => {
    if (hasChecked && isCorrect === false) {
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  // Handle check
  const handleCheck = useCallback(() => {
    if (!selectedChoice) return;

    const selectedOption = options.find((opt) => opt.id === selectedChoice);
    const isAnswerCorrect = selectedOption ? selectedOption.isCorrect : false;

    if (isAnswerCorrect) {
      playCorrectSound();
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
      setOpacity(0);
      onAnswer(true);
    } else {
      if (is2xTryActive) {
        consume2xTry();
        Toast.show({
          type: "info",
          text1: "Saved by 2x Try!",
          text2: "That was incorrect, try again!",
        });
        setSelectedChoice(null);
      } else {
        playIncorrectSound();
        setIsCorrect(false);
        setHasChecked(true);
        setOpacity(0);
        onAnswer(false);
        setShowWrongIcon(true);
      }
    }
  }, [
    selectedChoice,
    options,
    onAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound,
    playIncorrectSound,
  ]);

  // Video speed effect
  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]);

  // Effect for bomb item
  useEffect(() => {
    if (options) {
      setVisibleChoices(options as SharedQuestionOption[]);
    }
    // Don't clear on unmount - let BossFight manage this
  }, [options, setVisibleChoices]);

  // Render options
  const renderOptions = useMemo(
    () =>
      (visibleChoices || options).map((option) => (
        <MCBTN
          key={option.id}
          EnglishText={option.labelEn || ""}
          FilipinoText={`"${option.labelFil}"`}
          onPress={() => !hasChecked && setSelectedChoice(option.id)}
          clicked={hasChecked}
          isCorrect={option.isCorrect || true}
          isSelected={selectedChoice === option.id}
          hasChecked={hasChecked}
          rounded={50}
        />
      )),
    [visibleChoices, options, selectedChoice, hasChecked]
  );

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
    <View className="flex-1 relative bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hearts and Icon */}
        <View className="flex-row justify-center items-center mt-4">
          {Array.from({ length: hearts }).map((_, idx) => (
            <Text key={idx} style={{ fontSize: 24, color: "red" }}>
              ❤️
            </Text>
          ))}
          {showWrongIcon ? (
            <FSL_Wrong height={50} width={50} />
          ) : (
            <FSL_Fight height={50} width={50} />
          )}
        </View>

        {/* Prompts */}
            <Text className="text-4xl text-orange-400 font-PoppinsBold text-center">True or False!</Text>

        {/* Video */}
        <View className="w-full h-56 flex-row items-center justify-center mt-4">
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
         <View className="w-10/12 mx-auto mt-2">
          <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
            {enPrompt}
          </Text>
          <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
            {filPrompt}
          </Text>
        </View>

        {/* Options */}
        <View className="w-11/12 mx-auto mt-4">{renderOptions}</View>
      </ScrollView>

      {/* Fixed Elements */}
      {/* Inventory */}
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

      {/* Feedback and Buttons */}
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

      {/* Background */}
      <View className="absolute w-full bottom-0 z-10">
        {isCorrect === true ? (
          <CorrectBG width={"100%"}/>
        ) : isCorrect === false ? (
          <WrongBG width={"100%"}/>
        ) : (
          <LevelBg width={"100%"}/>
        )}
      </View>
    </View>
  );
};

export default BossTrueOrFalse;