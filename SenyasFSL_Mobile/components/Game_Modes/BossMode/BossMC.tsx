// BossMC.tsx

import { View, Text } from "react-native";
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
import Toast from "react-native-toast-message"; // ✅ FIX: Import Toast for the retry item

// ✅ --- IMPORT SOUND HOOK ---
import { useAnswerSounds } from "@/hooks/useAnswerSounds";

interface Option {
  id: string;
  labelEn: string;
  labelFil: string;
  isCorrect: boolean;
}

interface MultipleChoiceProps {
  key: string
  enPrompt: string;
  filPrompt: string;
  videoURL: string;
  options: Option[];
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossMultipleChoice: React.FC<MultipleChoiceProps> = ({
  key,
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

  // ✅ FIX: Get state for Bomb item
  const visibleChoices = useGameStore((state) => state.visibleChoices);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);

  // ✅ FIX: Get state for Retry item
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // --- Player Setup ---
  const player = useVideoPlayer("", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

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
  }, [videoURL]); // This is correct

  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]); // This is correct

  // ✅ FIX: Add this useEffect to load options into the store for the BOMB item
  useEffect(() => {
    if (options) {
      // Set the initial full list of options in the store
      setVisibleChoices(options as QuestionOption[]);
    }
    // When the component unmounts (question changes), clear the choices
    return () => {
      setVisibleChoices(null);
    };
  }, [options, setVisibleChoices]); // Run when the options prop changes

  // This is your logic for the wrong icon, it's fine
  useEffect(() => {
    if (hasChecked && isCorrect === false) {
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  // ✅ FIX: REPLACE your handleCheck with this new one for the RETRY item
  const handleCheck = useCallback(() => {
    if (!choice) return;

    const isAnswerCorrect = choice.isCorrect;

    if (isAnswerCorrect) {
      // --- CORRECT ANSWER ---
      playCorrectSound(); // ✅ ADDED
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
      onAnswer(true); // Tell the BossFight component it was correct
    } else {
      // --- INCORRECT ANSWER ---
      if (is2xTryActive) {
        // --- 2xTRY IS ACTIVE ---
        // 1. Consume the item
        consume2xTry();
        // 2. Show a toast message
        Toast.show({
          type: "info",
          text1: "Saved by 2x Try!",
          text2: "That was incorrect, try again!",
        });
        // 3. Reset the user's choice so they can pick again
        setChoice(null);
        // We DON'T set isCorrect, hasChecked, or call onAnswer(false)
      } else {
        // --- 2xTRY IS NOT ACTIVE ---
        // Normal incorrect logic
        playIncorrectSound(); // ✅ ADDED
        setIsCorrect(false);
        setHasChecked(true);
        onAnswer(false); // Tell the BossFight component it was wrong
        setShowWrongIcon(true); // Trigger your icon change
      }
    }
  }, [
    choice,
    onAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound, // ✅ ADDED
    playIncorrectSound, // ✅ ADDED
  ]);

  // ✅ FIX: Update renderOptions to use `visibleChoices` from the store
  const renderOptions = useMemo(
    () =>
      // Use the store's list first, fall back to props.options if store is empty
      (visibleChoices || options).map((item) => (
        <MCBTN
          // ✅ FIX: Add fallback values
          EnglishText={item.labelEn ?? ""}
          FilipinoText={item.labelFil ?? ""}
          onPress={() => !hasChecked && setChoice(item as Option)}
          clicked={hasChecked}
          // ✅ FIX: Add fallback value
          isCorrect={item.isCorrect ?? false}
          isSelected={choice?.id === item.id}
          hasChecked={hasChecked}
          rounded={50}
        />
      )),
    [visibleChoices, options, choice, hasChecked] // ✅ FIX: Add visibleChoices dependency
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center mt-8 text-gray-400">Loading video...</Text>
      </View>
    );
  }

  // --- JSX Render ---
  // (Your JSX is perfect, no changes needed here)
  return (
    <View className="flex-1 relative bg-white">
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
      {/* PROMPTS */}
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold">
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

export default React.memo(BossMultipleChoice);