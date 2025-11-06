import { View, Text } from "react-native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import VideoMCBTN from "./GameBtns/VideoMCBTN";
import Inventory from "@/components/main_interface/treasure/Inventory";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import { videoSpeed } from "@/utils/store/videoSpeed";

// ✅ --- IMPORTS FOR RETRY ---
import { useGameStore } from "@/hooks/useGameStore";
import Toast from "react-native-toast-message";

// ✅ --- IMPORT SOUND HOOK ---
import { useAnswerSounds } from "@/hooks/useAnswerSounds";

// ✅ --- REANIMATED IMPORTS ---
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

// --- Interfaces ---
export interface VideoQuestionOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
  videoSrc: string; // Can be "gs://" or full HTTPS URL
}

interface ViewMCProps {
  enPrompt: string;
  filPrompt: string;
  options: VideoQuestionOption[];
  onPress: () => void;
}

// ✅ --- SHUFFLE HELPER ---
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ✅ --- REANIMATED BUTTON WRAPPER ---
// This component wraps VideoMCBTN to give it a "pop" on selection
const AnimatedVideoMCButton: React.FC<{
  option: VideoQuestionOption;
  isSelected: boolean;
  hasChecked: boolean;
  isCorrect: boolean;
  videoSource: string;
  onPress: () => void;
}> = ({ option, isSelected, hasChecked, isCorrect, videoSource, onPress }) => {
  const scale = useSharedValue(1);

  // Animate scale based on selection
  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.03 : 1, {
      damping: 15,
      stiffness: 300,
    });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <VideoMCBTN
        key={option.id}
        labeFil={option.labelFil}
        labelEn={option.labelEn}
        isCorrect={isCorrect}
        hasChecked={hasChecked}
        clicked={hasChecked}
        isSelected={isSelected}
        onPress={onPress}
        videoSource={videoSource}
      />
    </Animated.View>
  );
};

const ViewMC: React.FC<ViewMCProps> = ({
  enPrompt,
  filPrompt,
  options,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null); // Stores labelEn
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const [resolvedVideos, setResolvedVideos] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const speed = videoSpeed((state) => state.playingSpeed);

  // ✅ --- REANIMATED SHARED VALUE ---
  // 0 = "Check" visible, 1 = "Next" visible
  const hasCheckedAnim = useSharedValue(0);

  // ✅ --- GAME STORE STATE (RETRY) ---
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // Determine the correct answer
  const correctAnswer = useMemo(() => {
    const correctOption = options.find((opt) => opt.isCorrect);
    return correctOption ? correctOption.labelEn : "";
  }, [options]);

  // ✅ --- 2-OPTION LOGIC ---
  const limitedOptions = useMemo(() => {
    const correctOption = options.find((opt) => opt.isCorrect);
    const incorrectOptions = options.filter((opt) => !opt.isCorrect);

    if (!correctOption) {
      // Fallback in case data is malformed
      return options.slice(0, 2);
    }
    if (incorrectOptions.length === 0) {
      // Fallback if only one option is provided
      return [correctOption];
    }

    // Get one random incorrect option
    const randomIncorrectOption =
      incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

    // Create and shuffle the new 2-item array
    return shuffleArray([
      correctOption,
      randomIncorrectOption,
    ]) as VideoQuestionOption[];
  }, [options]); // This recalculates only when the options prop changes

  // Fetch video URLs
  useEffect(() => {
    const fetchVideoUrls = async () => {
      try {
        setLoading(true);
        const results: Record<string, string> = {};

        // ✅ --- ONLY FETCH VIDEOS FOR THE 2 OPTIONS ---
        for (const option of limitedOptions) {
          let finalUrl = option.videoSrc;

          if (option.videoSrc.startsWith("gs://")) {
            console.log(`🔄 Fetching URL for: ${option.labelEn}`);
            try {
              finalUrl = await getVideoUrl(option.videoSrc);
            } catch (err) {
              console.error(
                `❌ Failed to fetch URL for ${option.labelEn}:`,
                err
              );
            }
          }
          results[option.id] = finalUrl;
        }
        setResolvedVideos(results);
      } catch (err)
        {
        console.error("❌ Error fetching video URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrls();
  }, [limitedOptions]); // ✅ --- DEPENDS ON limitedOptions ---

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY AND ANIMATION) ---
  const handleBG = useCallback(() => {
    if (!choice) return;

    // ✅ --- TRIGGER REANIMATED ANIMATION ---
    hasCheckedAnim.value = withTiming(1, { duration: 300 });

    const isAnswerCorrect = choice === correctAnswer;

    if (isAnswerCorrect) {
      // --- CORRECT ANSWER ---
      playCorrectSound(); // ✅ ADDED
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
        setChoice(null); // Reset choice
        // ✅ --- REVERSE ANIMATION ON RETRY ---
        hasCheckedAnim.value = withTiming(0, { duration: 300 });
      } else {
        // --- 2xTRY IS NOT ACTIVE ---
        playIncorrectSound(); // ✅ ADDED
        setIsCorrect(false);
        setHasChecked(true);
        setOpacity(0);
      }
    }
  }, [
    choice,
    correctAnswer,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound, // ✅ ADDED
    playIncorrectSound, // ✅ ADDED
    hasCheckedAnim,
  ]);

  // ✅ --- RENDER OPTIONS (NOW USES 2 OPTIONS + ANIMATED WRAPPER) ---
  const renderOptions = useMemo(() => {
    return limitedOptions.map((option) => (
      <AnimatedVideoMCButton
        key={option.id}
        option={option}
        isSelected={choice === option.labelEn}
        hasChecked={hasChecked}
        isCorrect={option.labelEn === correctAnswer}
        videoSource={resolvedVideos[option.id] || option.videoSrc}
        onPress={() => {
          if (!hasChecked) setChoice(option.labelEn);
        }}
      />
    ));
  }, [
    limitedOptions,
    choice,
    hasChecked,
    loading,
    resolvedVideos,
    correctAnswer,
  ]);

  // ✅ --- ANIMATED STYLES FOR BUTTONS ---
  const checkButtonAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      hasCheckedAnim.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      hasCheckedAnim.value,
      [0, 1],
      [1, 0.8],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const nextButtonAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      hasCheckedAnim.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      hasCheckedAnim.value,
      [0, 1],
      [0.8, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
      // Position absolute to animate in place
      position: "absolute",
      width: "100%",
    };
  });

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
      {/* PROMPTS */}
      <Text className="text-3xl font-PoppinsBold text-[#FB990F] text-center my-2">Choose the Sign!</Text>
      <Text className="text-center font-PoppinsBold my-2 text-xl md:text-3xl">
        {enPrompt}
      </Text>
      <Text className="text-center font-PoppinsLightItalic my-1 text-lg md:text-3xl">
        "{filPrompt}"
      </Text>

      {/* VIDEO CHOICES */}
      <View className="w-2/3">{renderOptions}</View>

      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* FEEDBACK & BUTTONS */}
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

        {/* ✅ --- REANIMATED BUTTON CONTAINER --- */}
        <View className="w-full h-[58px] items-center justify-center">
          {/* "Next" button (animated in) */}
          {hasChecked && (
            <Animated.View style={nextButtonAnimStyle}>
              <LevelContentBtn text="Next" onPress={onPress} />
            </Animated.View>
          )}

          {/* "Check" button (animated out) */}
          {choice && (
            <Animated.View style={checkButtonAnimStyle}>
              <LevelContentBtn text="Check" onPress={handleBG} />
            </Animated.View>
          )}
        </View>
      </View>

      {/* BACKGROUND */}
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

export default React.memo(ViewMC);