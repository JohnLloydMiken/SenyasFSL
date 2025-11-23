import { View, Text, ScrollView } from "react-native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "@/components/Game_Modes/GameBtns/LevelContentBtn";
import VideoMCBTN from "@/components/Game_Modes/GameBtns/VideoMCBTN";
import Inventory from "@/components/main_interface/treasure/Inventory";
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
export interface VideoQuestionOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
  videoSrc: string;
}

interface ViewMCProps {
  enPrompt: string;
  filPrompt: string;
  options: VideoQuestionOption[];
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossViewMC: React.FC<ViewMCProps> = ({
  enPrompt,
  filPrompt,
  options,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);
  const [resolvedVideos, setResolvedVideos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showWrongIcon, setShowWrongIcon] = useState(false);

  // Game store state
  const visibleChoices = useGameStore((state) => state.visibleChoices);
  const setVisibleChoices = useGameStore((state) => state.setVisibleChoices);
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // Sound hook
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // Determine correct answer
  const correctAnswer = useMemo(() => {
    const correctOption = options.find((opt) => opt.isCorrect);
    return correctOption ? correctOption.labelEn : "";
  }, [options]);

  // Fetch video URLs
  useEffect(() => {
    const fetchVideoUrls = async () => {
      try {
        setLoading(true);
        const results: Record<string, string> = {};

        for (const option of options) {
          let finalUrl = option.videoSrc;

          if (option.videoSrc.startsWith("gs://")) {
            console.log(`📄 Fetching URL for: ${option.labelEn}`);
            try {
              finalUrl = await getVideoUrl(option.videoSrc);
            } catch (err) {
              console.error(`❌ Failed to fetch URL for ${option.labelEn}:`, err);
            }
          }
          results[option.id] = finalUrl;
        }
        setResolvedVideos(results);
      } catch (err) {
        console.error("❌ Error fetching video URLs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoUrls();
  }, [options]);

  // Wrong icon effect
  useEffect(() => {
    if (hasChecked && isCorrect === false) {
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  // Effect for bomb item
  useEffect(() => {
    if (options) {
      setVisibleChoices(options as SharedQuestionOption[]);
    }
    // Don't clear on unmount - let BossFight manage this
  }, [options, setVisibleChoices]);

  // Handle check
  const handleBG = useCallback(() => {
    if (!choice) return;

    const isAnswerCorrect = choice === correctAnswer;

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
        setChoice(null);
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
    choice,
    correctAnswer,
    onAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound,
    playIncorrectSound,
  ]);

  // Render options
  const renderOptions = useMemo(() => {
    return ((visibleChoices || options) as VideoQuestionOption[]).map(
      (option) => (
        <VideoMCBTN
          key={option.id}
          labeFil={option.labelFil}
          labelEn={option.labelEn}
          isCorrect={option.labelEn === correctAnswer}
          hasChecked={hasChecked}
          clicked={hasChecked}
          isSelected={choice === option.labelEn}
          onPress={() => {
            if (!hasChecked) setChoice(option.labelEn);
          }}
          videoSource={resolvedVideos[option.id] || option.videoSrc}
        />
      )
    );
  }, [
    visibleChoices,
    options,
    choice,
    hasChecked,
    loading,
    resolvedVideos,
    correctAnswer,
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
             <Text className="text-4xl text-orange-400 font-PoppinsBold text-center my-2">Fill in the Gaps!</Text>
        <Text className="text-center font-PoppinsBold text-xl md:text-3xl mt-2">
          {enPrompt}
        </Text>
        <Text className="text-center font-PoppinsLightItalic text-lg md:text-3xl">
          {filPrompt}
        </Text>

        {/* Video Choices */}
        <View className="w-2/3 mx-auto mt-4">{renderOptions}</View>
  

      {/* Fixed Elements */}
      {/* Inventory Button */}
      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* Feedback & Buttons */}
      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
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

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleBG} />
        ) : (
          hasChecked && <LevelContentBtn text="Next" onPress={onPress} />
        )}
      </View>

      {/* Background */}
      <View className="absolute w-full bottom-0 z-10">
        {isCorrect === true ? (
          <CorrectBG />
        ) : isCorrect === false ? (
          <WrongBG />
        ) : (
          <LevelBg />
        )}
      </View>
          </ScrollView>
    </View>
  );
};

export default React.memo(BossViewMC);