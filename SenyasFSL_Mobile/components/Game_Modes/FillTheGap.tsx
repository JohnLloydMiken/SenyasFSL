import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";

import LevelContentBtn from "./GameBtns/LevelContentBtn";
import MCBTN from "./GameBtns/MCBTN";
import Inventory from "../main_interface/treasure/Inventory";

import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import { videoSpeed } from "@/utils/store/videoSpeed";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";

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
// This component wraps MCBTN to give it a "pop" on selection
const AnimatedMCButton: React.FC<{
  option: QuestionOption;
  isSelected: boolean;
  isCorrect: boolean;
  hasChecked: boolean;
  onPress: () => void;
}> = ({ option, isSelected, isCorrect, hasChecked, onPress }) => {
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
      <MCBTN
        EnglishText={option.labelEn}
        FilipinoText={option.labelFil}
        rounded={6}
        hasChecked={hasChecked}
        isCorrect={isCorrect}
        isSelected={isSelected}
        onPress={onPress}
        clicked={hasChecked}
      />
    </Animated.View>
  );
};

const FillTheGap: React.FC<FillTheGapProps> = ({
  enPrompt,
  filPrompt,
  videoURL,
  options,
  message,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null); // store selected option id
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);

  // ✅ --- REANIMATED SHARED VALUE ---
  // 0 = "Check" visible, 1 = "Next" visible
  const hasCheckedAnim = useSharedValue(0);

  // ✅ --- GAME STORE STATE (RETRY) ---
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // Find the correct option (used for both logic and 2-option selection)
  const correctOption = useMemo(
    () => options.find((opt) => opt.isCorrect) || null,
    [options]
  );

  // ✅ --- 2-OPTION LOGIC ---
  const limitedOptions = useMemo(() => {
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
    return shuffleArray([correctOption, randomIncorrectOption]);
  }, [options, correctOption]); // This recalculates only when the options prop changes

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY AND ANIMATION) ---
  const handleCheck = useCallback(() => {
    if (!choice) return;

    // ✅ --- TRIGGER REANIMATED ANIMATION ---
    hasCheckedAnim.value = withTiming(1, { duration: 300 });

    const selectedOption = options.find((opt) => opt.id === choice);
    const isAnswerCorrect = selectedOption ? selectedOption.isCorrect : false;

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
    options,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound, // ✅ ADDED
    playIncorrectSound, // ✅ ADDED
    hasCheckedAnim,
  ]);

  // Initialize video player
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Fetch video URL
  useEffect(() => {
    const loadVideo = async () => {
      try {
        let finalUrl = videoURL;
        if (videoURL.startsWith("gs://")) {
          finalUrl = await getVideoUrl(videoURL);
        }
        setResolvedUrl(finalUrl);
        await player.replace({ uri: finalUrl });
        await player.play();
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
      {/* ✅ --- NEW STATIC TITLE (from image) --- */}
      <Text className="font-PoppinsBold text-3xl text-orange-500 text-center my-2">
        Fill in the Gap!
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

      {/* ✅ --- QUESTION BOX (Updated layout from image) --- */}
      <View className="w-11/12 rounded-md border border-[#F7D674] p-4 items-center mt-2">
        <Text className="text-center font-PoppinsSemiBold text-lg md:text-xl">
          {enPrompt}
        </Text>
        <Text className="text-center font-PoppinsLightItallic text-base md:text-lg">
          {filPrompt}
        </Text>

        {hasChecked ? (
          <LinearGradient
            colors={isCorrect ? ["#31F705", "#007D00"] : ["#FF6A6C", "#A20000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              width: "50%", // Increased width to better fit answers
              borderRadius: 6,
              backgroundColor: "transparent",
              elevation: 5,
              padding: 1,
              marginTop: 10,
              marginBottom: 10,
              zIndex: 50,
            }}
          >
            <View className="rounded-md w-full p-2">
              <Text className="text-sm md:text-lg font-PoppinsBold text-white text-center">
                {options.find((opt) => opt.id === choice)?.labelEn || ""}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View className="w-16 h-10 bg-gray-400 rounded-md mt-2" />
        )}
      </View>

      {/* ✅ --- OPTIONS (now 2 options) --- */}
      <View className="w-11/1View 1/12 flex-row flex-wrap justify-between mt-4">
        {limitedOptions.map((option) => (
          <View key={option.id} className="w-[45%] mb-3 relative items-center mx-1">
            <View
              className={`${
                hasChecked && choice === option.id ? "opacity-0" : "opacity-100"
              } w-full`}
            >
              <AnimatedMCButton
                option={option}
                isSelected={choice === option.id}
                isCorrect={option.id === correctOption?.id}
                hasChecked={hasChecked}
                onPress={() => {
                  if (!hasChecked) setChoice(option.id);
                }}
              />
            </View>
            
          </View>
        ))}
      </View>

      <View
        className={`w-full p-4 mx-auto absolute bottom-20 z-50 opacity-${opacity}`}
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

        {/* ✅ --- REANIMATED BUTTON CONTAINER --- */}
        <View className="w-2/3 mx-auto h-[58px] items-center justify-center">
          {/* "Next" button (animated in) */}
          {hasChecked && (
            <Animated.View style={nextButtonAnimStyle}>
              <LevelContentBtn text="Next" onPress={onPress} />
            </Animated.View>
          )}

          {/* "Check" button (animated out) */}
          {choice && (
            <Animated.View style={checkButtonAnimStyle}>
              <LevelContentBtn text="Check" onPress={handleCheck} />
            </Animated.View>
          )}
        </View>
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

export default FillTheGap;