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
  // ✅ 1. State to control the icon visibility
  const [showWrongIcon, setShowWrongIcon] = useState(false);

  const player = useVideoPlayer("", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

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

  // ✅ 2. When an incorrect answer is checked, show the wrong icon temporarily
  useEffect(() => {
    // Only run this logic if an answer has been checked and it was wrong
    if (hasChecked && isCorrect === false) {
      // Set a timer to switch the icon back to the default "fight" icon
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500); // 1.5-second delay before hiding the wrong icon

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  const handleCheck = useCallback(() => {
    if (!choice) return;

    const correct = choice.isCorrect;
    setIsCorrect(correct);
    setHasChecked(true);
    onAnswer(correct);

    if (correct) {
      incrementScore();
    } else {
      // If the answer is wrong, trigger the icon change
      setShowWrongIcon(true);
    }
  }, [choice, onAnswer, incrementScore]);

  const renderOptions = useMemo(
    () =>
      options.map((item) => (
        <MCBTN
          key={item.id}
          EnglishText={item.labelEn}
          FilipinoText={item.labelFil}
          onPress={() => !hasChecked && setChoice(item)}
          clicked={hasChecked}
          isCorrect={item.isCorrect}
          isSelected={choice?.id === item.id}
          hasChecked={hasChecked}
          rounded={50}
        />
      )),
    [options, choice, hasChecked]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center mt-8 text-gray-400">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white">
      <View className=" flex-row justify-center items-center ">
        {Array.from({ length: hearts }).map((_, idx) => (
          <Text key={idx} style={{ fontSize: 24, color: "red" }}>
            ❤️
          </Text>
        ))}
        {/* ✅ 3. Conditionally render the correct SVG */}
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
