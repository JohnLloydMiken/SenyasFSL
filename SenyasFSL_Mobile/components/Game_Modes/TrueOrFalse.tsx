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

// ✅ --- REANIMATED BUTTON WRAPPER ---
// This component wraps MCBTN to give it a "pop" on selection
const AnimatedMCButton: React.FC<{
  option: TrueFalseOption;
  isSelected: boolean;
  hasChecked: boolean;
  onPress: () => void;
}> = ({ option, isSelected, hasChecked, onPress }) => {
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
        key={option.id}
        EnglishText={option.labelEn}
        FilipinoText={`"${option.labelFil}"`}
        onPress={onPress}
        clicked={hasChecked}
        isCorrect={!option.isCorrect} // Original inverted logic
        isSelected={isSelected}
        hasChecked={hasChecked}
        rounded={50}
      />
    </Animated.View>
  );
};

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

  // ✅ --- REANIMATED SHARED VALUE ---
  // 0 = "Check" visible, 1 = "Next" visible
  const hasCheckedAnim = useSharedValue(0);

  // ✅ --- GAME STORE STATE (RETRY) ---
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

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

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY AND ANIMATION) ---
  const handleCheck = useCallback(() => {
    if (!selectedChoice) return;

    // ✅ --- TRIGGER REANIMATED ANIMATION ---
    hasCheckedAnim.value = withTiming(1, { duration: 300 });

    const selectedOption = options.find((opt) => opt.id === selectedChoice);
    // Note: Original logic for TF is inverted
    const isAnswerCorrect = selectedOption ? !selectedOption.isCorrect : false;

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
        setSelectedChoice(null); // Reset choice
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
    selectedChoice,
    options,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound, // ✅ ADDED
    playIncorrectSound, // ✅ ADDED
    hasCheckedAnim,
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
      <Text className="text-[#FB990F] text-3xl font-PoppinsBold text-center my-2">True or False!</Text>
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

      <View className="w-10/12 my-3">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          {filQuestion}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          {enQuestion}
        </Text>
      </View>

      <View className="w-11/12 mx-auto">
        {/* ✅ --- RENDER OPTIONS (NOW ANIMATED) --- */}
        {options.map((option) => (
          <AnimatedMCButton
            key={option.id}
            option={option}
            isSelected={selectedChoice === option.id}
            hasChecked={hasChecked}
            onPress={() => !hasChecked && setSelectedChoice(option.id)}
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

        {/* ✅ --- REANIMATED BUTTON CONTAINER --- */}
        <View className="w-full h-[58px] items-center justify-center">
          {/* "Next" button (animated in) */}
          {hasChecked && (
            <Animated.View style={nextButtonAnimStyle}>
              <LevelContentBtn text="Next" onPress={onPress} />
            </Animated.View>
          )}

          {/* "Check" button (animated out) */}
          {selectedChoice && (
            <Animated.View style={checkButtonAnimStyle}>
              <LevelContentBtn text="Check" onPress={handleCheck} />
            </Animated.View>
          )}
        </View>
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
