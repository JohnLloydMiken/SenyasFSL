// BossMC.tsx

import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "@/components/Game_Modes/GameBtns/LevelContentBtn";
import MCBTN from "@/components/Game_Modes/GameBtns/MCBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import Inventory from "@/components/main_interface/treasure/Inventory";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import FSL_Fight from "@/assets/svgs/FSL_Fight.svg";
import FSL_Wrong from "@/assets/svgs/FSL_wrong.svg";
import { videoSpeed } from "@/utils/store/videoSpeed";
import { useGameStore } from "@/hooks/useGameStore";
import { QuestionOption } from "@/shared/types/index";
import Toast from "react-native-toast-message";
import { useAnswerSounds } from "@/hooks/useAnswerSounds";

interface Option {
  id: string;
  labelEn: string;
  labelFil: string;
  isCorrect: boolean;
}

interface MultipleChoiceProps {
  enPrompt: string;
  filPrompt: string;
  videoURL: string;
  options: Option[];
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossMultipleChoice: React.FC<MultipleChoiceProps> = ({
  enPrompt,
  filPrompt,
  videoURL,
  options,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [choice, setChoice] = useState<Option | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);
  const [showWrongIcon, setShowWrongIcon] = useState(false);

  // --- Game Store State ---
  const visibleChoices = useGameStore((state) => state.visibleChoices);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);

  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // --- Player Setup ---
  const player = useVideoPlayer("", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
  console.log("🔍 [BossMC] Setting visibleChoices, options:", options);
  if (options) {
    setVisibleChoices(options as QuestionOption[]);
    console.log("🔍 [BossMC] Called setVisibleChoices with:", options);
  }
  // Don't clear on unmount - let BossFight manage this
}, [options, setVisibleChoices]);

// Add this right after your state declarations in BossMC
useEffect(() => {
  console.log("🔍 [BossMC] visibleChoices changed:", visibleChoices);
}, [visibleChoices]);

  // --- Video Loading Effects ---
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
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

  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]);

  useEffect(() => {
    if (options) {
      setVisibleChoices(options as QuestionOption[]);
    }
    // Don't clear on unmount - let BossFight manage this
  }, [options, setVisibleChoices]);

  useEffect(() => {
    if (hasChecked && isCorrect === false) {
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

    
  const handleCheck = useCallback(() => {
    if (!choice) return;

    const isAnswerCorrect = choice.isCorrect;

    if (isAnswerCorrect) {
      playCorrectSound();
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
      onAnswer(true);
    } else {
      if (is2xTryActive) {
        consume2xTry();
        Toast.show({
          type: "info",
          text1: "Saved by 2x Try!",
          text2: "That was incorrect, try again!",
        });
        setChoice(null);
      } else {
        playIncorrectSound();
        setIsCorrect(false);
        setHasChecked(true);
        onAnswer(false);
        setShowWrongIcon(true);
      }
    }
  }, [
    choice,
    onAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound,
    playIncorrectSound,
  ]);

  const renderOptions = useMemo(
    () =>
      (visibleChoices || options).map((item) => (
        <MCBTN
          key={item.id}
          EnglishText={item.labelEn ?? ""}
          FilipinoText={item.labelFil ?? ""}
          onPress={() => !hasChecked && setChoice(item as Option)}
          clicked={hasChecked}
          isCorrect={item.isCorrect ?? false}
          isSelected={choice?.id === item.id}
          hasChecked={hasChecked}
          rounded={50}
        />
      )),
    [visibleChoices, options, choice, hasChecked]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center mt-8 text-gray-400">Loading video...</Text>
      </View>
    );
  }

  // --- JSX Render ---
  return (
    <View className="flex-1 relative bg-white">
      {/* WRAPPED CONTENT IN SCROLLVIEW */}
      <ScrollView
        className="flex-1"
        // PADDING BOTTOM: Ensures the last option isn't hidden behind the fixed Inventory/Buttons
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <View className=" flex-row justify-center items-center mt-4">
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

        {/* PROMPTS */}
        <Text className="text-4xl text-orange-400 font-PoppinsBold text-center my-2">Multiple Choice!</Text>

        {/* VIDEO */}
        {/* Changed h-[30%] to h-64 (approx 256px) so it doesn't collapse in ScrollView */}
        <View className="w-full h-64 relative -top-1 z-50">
          <VideoView
            style={{ width: "100%", height: "100%" }}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        </View>
           <Text className="text-center text-2xl md:text-3xl font-PoppinsBold mt-2">
          {enPrompt}
        </Text>
        <Text className="text-center text-xl md:text-2xl font-PoppinsLightItalic my-2">
          {filPrompt}
        </Text>
        {/* MULTIPLE CHOICE OPTIONS */}
        <View className="w-11/12 mx-auto mt-4">{renderOptions}</View>
     

      {/* --- FIXED ELEMENTS (FLOATING) --- */}

      {/* INVENTORY */}
      <View className="w-full p-4 mx-auto absolute bottom-32 z-50">
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
      {/* Kept at bottom with z-10 so it stays fixed behind the scrolling content (parallax effect) */}
      <View className="absolute w-full bottom-0 z-0">
        {isCorrect === true ? (
          <CorrectBG width={"100%"}/>
        ) : isCorrect === false ? (
          <WrongBG width={"100%"} />
        ) : (
          <LevelBg width={"100%"}/>
        )}
      </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(BossMultipleChoice);