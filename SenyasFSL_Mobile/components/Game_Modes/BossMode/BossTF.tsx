import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
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
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossTrueOrFalse: React.FC<TrueOrFalseProps> = ({
  enQuestion,
  filQuestion,
  videoURL,
  options,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null); // stores option id
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWrongIcon, setShowWrongIcon] = useState(false);
  const incrementScore = useUserPoints((state) => state.incrementScore);
  const speed = videoSpeed((state) => state.playingSpeed);
  const correctAnswer = useMemo(() => {
    const correctOpt = options.find((opt) => !opt.isCorrect);
    return correctOpt ? correctOpt.labelEn : "";
  }, [options]);

  // Create video player without source initially
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Fetch and resolve video URL then update player
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

  const handleCheck = () => {
    if (selectedChoice) {
      const selectedOption = options.find((opt) => opt.id === selectedChoice);
      const correct = selectedOption ? !selectedOption.isCorrect : false;
      setIsCorrect(correct);
      setHasChecked(true);
      setOpacity(0);
      onAnswer(correct);
      if (correct) {
        incrementScore();
      }else{
         setShowWrongIcon(true);
      }
    }
  };

  useEffect(() => {
          if (player) {
            player.playbackRate = speed;
          }
        }, [speed, player]); // Dependencies: speed and player

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
        {/* ✅ 3. Conditionally render the correct SVG */}
        {showWrongIcon ? (
          <FSL_Wrong height={50} width={50} />
        ) : (
          <FSL_Fight height={50} width={50} />
        )}
      </View>
      <View className="w-10/12">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          {filQuestion}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          {enQuestion}
        </Text>
      </View>

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

      <View className="w-11/12 mx-auto">
        {options.map((option) => (
          <MCBTN
            key={option.id}
            EnglishText={option.labelEn}
            FilipinoText={`"${option.labelFil}"`}
            onPress={() => !hasChecked && setSelectedChoice(option.id)}
            clicked={hasChecked}
            isCorrect={!option.isCorrect}
            isSelected={selectedChoice === option.id}
            hasChecked={hasChecked}
            rounded={50}
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

        {selectedChoice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleCheck} />
        ) : hasChecked ? (
          <LevelContentBtn text="Next" onPress={onPress} />
        ) : null}
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

export default BossTrueOrFalse;
