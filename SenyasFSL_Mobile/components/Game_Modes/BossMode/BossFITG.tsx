import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
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

// ✅ --- IMPORTS FOR BOMB/RETRY ---
import { useGameStore } from "@/hooks/useGameStore";
import { QuestionOption as SharedQuestionOption } from "@/shared/types/index";
import Toast from "react-native-toast-message";

// ✅ --- IMPORT SOUND HOOK ---
import { useAnswerSounds } from "@/hooks/useAnswerSounds";

// --- Interfaces ---
export interface QuestionOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
}

interface FillTheGapProps {
  enPrompt: string;
  filPrompt: string;
  videoURL: string;
  options: readonly QuestionOption[];
  message: string;
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
    key: string
}

const BossFillTheGap: React.FC<FillTheGapProps> = ({
  enPrompt,
  filPrompt,
  videoURL,
  options,
  message,
  onPress,
  onAnswer,
  hearts,
  key
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null); // store selected option id
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWrongIcon, setShowWrongIcon] = useState(false);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);

  // ✅ --- GAME STORE STATE (BOMB/RETRY) ---
  const visibleChoices = useGameStore((state) => state.visibleChoices);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // ✅ Find the correct option
  const correctOption = useMemo(
    () => options.find((opt) => opt.isCorrect) || null,
    [options]
  );

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY) ---
  const handleCheck = useCallback(() => {
    if (!choice) return;

    const selectedOption = options.find((opt) => opt.id === choice);
    const isAnswerCorrect = selectedOption ? selectedOption.isCorrect : false;

    if (isAnswerCorrect) {
      // --- CORRECT ANSWER ---
      playCorrectSound(); // ✅ ADDED
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
      setOpacity(0);
      onAnswer(true);
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
        setChoice(null); // Reset choice
      } else {
        // --- 2xTRY IS NOT ACTIVE ---
        playIncorrectSound(); // ✅ ADDED
        setIsCorrect(false);
        setHasChecked(true);
        setOpacity(0);
        onAnswer(false);
        setShowWrongIcon(true);
      }
    }
  }, [
    choice,
    options,
    onAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound, // ✅ ADDED
    playIncorrectSound, // ✅ ADDED
  ]);

  // --- Video Player Setup ---
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // --- Video Loading Effects ---
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
        console.error("Error loading video:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [videoURL]);

  // --- Wrong Icon Effect ---
  useEffect(() => {
    if (hasChecked && isCorrect === false) {
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  // --- Video Speed Effect ---
  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]);

  // ✅ --- EFFECT FOR BOMB ITEM ---
  useEffect(() => {
    if (options) {
      setVisibleChoices(options as SharedQuestionOption[]);
    }
    return () => {
      setVisibleChoices(null);
    };
  }, [options, setVisibleChoices]);

  // ✅ --- RENDER OPTIONS (UPDATED FOR BOMB) ---
  const renderOptions = useMemo(
    () =>
      (visibleChoices || options).map((option) => (
        <View
          key={option.id}
          className="w-[48%]  relative items-center"
        >
          <View
            className={`${
              hasChecked && choice === option.id ? "opacity-0" : "opacity-100"
            } w-full`}
          >
            <MCBTN
              EnglishText={option.labelEn || ""}
              FilipinoText={option.labelFil || ""}
              rounded={6}
              hasChecked={hasChecked}
              isCorrect={option.id === correctOption?.id}
              isSelected={choice === option.id}
              onPress={() => {
                if (!hasChecked) setChoice(option.id);
              }}
              clicked={hasChecked}
            />
          </View>
          <View className="absolute w-24 h-8 bg-[#E6E6E6] rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
        </View>
      )),
    [visibleChoices, options, choice, hasChecked, correctOption]
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
    <View className="flex-1 relative items-center bg-white">
      <View className=" flex-row justify-center items-center ">
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
      <Text className="font-PoppinsBold text-2xl md:text-3xl">{enPrompt}</Text>
      <Text className="font-PoppinsLightItallic text-xl md:text-3xl">
        {filPrompt}
      </Text>

      {/* Video */}
      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View className="bg-white/60 w-full p-4 absolute bottom-0 opacity-0">
          <Text className="text-sm text-center font-PoppinsRegular">
            {isCorrect}
          </Text>
        </View>
      </View>

      {/* Question */}
      <View className="w-11/12 rounded-md border border-[#F7D674] p-4 items-center">
        {hasChecked ? (
          <LinearGradient
            colors={isCorrect ? ["#31F705", "#007D00"] : ["#FF6A6C", "#A20000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              width: "50%",
              borderRadius: 6,
              backgroundColor: "transparent",
              elevation: 5,
              padding: 1,
              marginTop: 10,
              marginBottom: 10,
              zIndex: 50,
            }}
          >
            <View className="rounded-full w-full p-2">
              <Text className="text-ls md:text-xl font-PoppinsBold text-white text-center">
                {options.find((opt) => opt.id === choice)?.labelEn || ""}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View className="w-16 h-10 bg-gray-400" />
        )}
      </View>

      {/* Options */}
      <View className="w-11/12 flex-row flex-wrap justify-between mt-2">
        {renderOptions}
      </View>

      {/* Inventory Button */}
      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked(!isClicked)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* Feedback Section */}
      <View className="absolute bottom-6 w-96 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect === true && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Correct!
            </Text>
          </View>
        )}

        {isCorrect === false && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Incorrect!
            </Text>
          </View>
        )}

        {hasChecked && (
          <Text className="text-center text-white font-NunitoBold text-sm">
            {message}
          </Text>
        )}

        {choice && !hasChecked ? (
          <View className="w-2/3 mx-auto">
            <LevelContentBtn text="Check" onPress={handleCheck} />
          </View>
        ) : (
          hasChecked && (
            <View className="w-2/3 mx-auto">
              <LevelContentBtn text="Next" onPress={onPress} />
            </View>
          )
        )}
      </View>

      {/* Backgrounds */}
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

export default BossFillTheGap;