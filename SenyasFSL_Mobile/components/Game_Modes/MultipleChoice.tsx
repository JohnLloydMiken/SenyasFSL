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
  item: Option;
  isSelected: boolean;
  hasChecked: boolean;
  onPress: () => void;
}> = ({ item, isSelected, hasChecked, onPress }) => {
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
        key={item.id}
        EnglishText={item.labelEn}
        FilipinoText={item.labelFil}
        onPress={onPress}
        clicked={hasChecked}
        isCorrect={item.isCorrect}
        isSelected={isSelected}
        hasChecked={hasChecked}
        rounded={50}
      />
    </Animated.View>
  );
};

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

  // ✅ --- REANIMATED SHARED VALUE ---
  // 0 = "Check" visible, 1 = "Next" visible
  const hasCheckedAnim = useSharedValue(0);

  // ✅ --- GAME STORE STATE (RETRY) ---
  const is2xTryActive = useGameStore((state) => state.is2xTryActive);
  const consume2xTry = useGameStore((state) => state._consume2xTry);

  // ✅ --- USE SOUND HOOK ---
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

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
    return shuffleArray([correctOption, randomIncorrectOption]);
  }, [options]); // This recalculates only when the options prop changes

  // Initialize player
  const player = useVideoPlayer("", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Load and update video
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
  }, [speed, player]);

  // ✅ --- HANDLE CHECK (UPDATED FOR RETRY AND ANIMATION) ---
  const handleCheck = useCallback(() => {
    if (!choice) return;

    // ✅ --- TRIGGER REANIMATED ANIMATION ---
    hasCheckedAnim.value = withTiming(1, { duration: 300 });

    const isAnswerCorrect = choice.isCorrect;

    if (isAnswerCorrect) {
      // --- CORRECT ANSWER ---
      playCorrectSound(); // ✅ ADDED
      incrementScore();
      setIsCorrect(true);
      setHasChecked(true);
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
      }
    }
  }, [
    choice,
    incrementScore,
    is2xTryActive,
    consume2xTry,
    playCorrectSound,
    playIncorrectSound,
    hasCheckedAnim,
  ]);

  // ✅ --- RENDER OPTIONS (NOW USES 2 OPTIONS + ANIMATED WRAPPER) ---
  const renderOptions = useMemo(
    () =>
      limitedOptions.map((item) => (
        <AnimatedMCButton
          key={item.id}
          item={item}
          isSelected={choice?.id === item.id}
          hasChecked={hasChecked}
          onPress={() => {
            if (!hasChecked) setChoice(item);
          }}
        />
      )),
    [limitedOptions, choice, hasChecked]
  );

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
        <Text className="text-center mt-8 text-gray-400">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white">
    
      <Text className="font-PoppinsBold text-3xl my-2 md:text-3xl text-center text-[#FB990F]">Choose The Correct Sign!</Text>
     

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

       <Text className="text-center text-2xl md:text-3xl font-PoppinsBold">
        {enPrompt}
      </Text>
      <Text className="text-center text-xl md:text-2xl font-PoppinsLightItalic">
        "{filPrompt}"
      </Text>

      {/* MULTIPLE CHOICE OPTIONS */}
      <View className="w-11/12 mx-auto mt-4">{renderOptions}</View>
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
              <LevelContentBtn text="Check" onPress={handleCheck} />
            </Animated.View>
          )}
        </View>
      </View>

      {/* BACKGROUND STATE */}
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

export default React.memo(MultipleChoice);