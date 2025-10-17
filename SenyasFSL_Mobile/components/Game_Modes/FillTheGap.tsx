import { View, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import MCBTN from "./GameBtns/MCBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";

import Inventory from "../main_interface/Inventory";

import { LinearGradient } from "expo-linear-gradient";

export interface QuestionOption {
  id: string;
  incorrect: boolean;
  labelEn: string;
  labelFil: string;
}

interface FillTheGapProps {
  enPrompt: string;
  filPrompt: string;
  videoURL: string; // Changed from videoSource
  options: readonly QuestionOption[]; // Changed from choices
  message: string;
  onPress: () => void;
}

const FillTheGap: React.FC<FillTheGapProps> = ({
  enPrompt,
  filPrompt,
  videoURL,
  options,
  message,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null); // Will store the selected labelEn
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);

  // 1. Derive the correct answer from the options prop
  const correctAnswer = useMemo(() => {
    const correctOption = options.find((opt) => opt.incorrect === false);
    return correctOption ? correctOption.labelEn : ""; // Assuming we check against the English label
  }, [options]);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === correctAnswer);
      setHasChecked(true);
      setOpacity(0);
    }
  };

  // 2. Use the videoURL prop directly
  // IMPORTANT: See note below about gs:// vs https:// URLs
  const player = useVideoPlayer(videoURL, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });

  return (
    <View className="flex-1 relataive items-center bg-white">
      <Text className="font-PoppinsBold text-2xl md:text-3xl">{enPrompt}</Text>
      <Text className="font-PoppinsLightItallic text-xl md:text-3xl">
        {filPrompt}
      </Text>

      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View className={`bg-white/60 w-full p-4 absolute bottom-0 opacity-0`}>
          <Text className="text-sm text-center font-PoppinsRegular">
            {correctAnswer}
          </Text>
        </View>
      </View>

      <View className="w-11/12 rounded-md border border-[#F7D674] p-4 flex-col justify-center items-center">
        <Text className="text-center font-PoppinsSemiBold text-lg md:text-xl">
          {enPrompt}
        </Text>
        {hasChecked === true ? (
          <LinearGradient
            colors={
              hasChecked === true && isCorrect === true
                ? ["#31F705", "#007D00"]
                : ["#FF6A6C", "#A20000"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              width: "20%",
              borderRadius: 6,
              backgroundColor: "transparent",
              elevation: 5,
              padding: 1,
              marginTop: 10,
              marginBottom: 10,
              zIndex: 50,
            }}
          >
            <View className=" rounded-full w-full p-2">
              <Text className="text-sm md:text-lg font-PoppinsBold text-white text-center">
                {choice}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View className="w-16 h-10 bg-gray-400"></View>
        )}
      </View>

      <View className="w-11/12 flex-row flex-wrap justify-between mt-4">
        {options.map((option) => {
          const choiceLabel = option.labelEn;

          return (
            <View
              key={option.id}
              className="w-[48%] mb-5 relative items-center"
            >
              {/* The button itself */}
              <View
                className={`${
                  hasChecked && choice === choiceLabel
                    ? "opacity-0"
                    : "opacity-100"
                } w-full`}
              >
                <MCBTN
                  EnglishText={choiceLabel}
                  FilipinoText={option.labelFil}
                  rounded={6}
                  hasChecked={hasChecked}
                  isCorrect={choiceLabel === correctAnswer}
                  isSelected={choice === choiceLabel}
                  onPress={() => {
                    if (!hasChecked) setChoice(choiceLabel);
                  }}
                  clicked={hasChecked}
                />
              </View>

              {/* Background gray overlay */}
              <View className="absolute w-24 h-8 bg-[#E6E6E6] rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
            </View>
          );
        })}
      </View>

      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked(!isClicked)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      <View className="absolute bottom-6 w-96 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2 ">
        <View
          className={`flex-row mx-auto justify-center items-center gap-2 ${
            isCorrect == null
              ? "hidden"
              : isCorrect === true
                ? "flex"
                : "hidden"
          }`}
        >
          <CorrectIcon />
          <Text className="font-PoppinsBold text-lg md:text-xl text-white">
            Correct!
          </Text>
        </View>

        <View
          className={`flex-row mx-auto justify-center items-center gap-2 ${
            isCorrect == null
              ? "hidden"
              : isCorrect === false
                ? "flex"
                : "hidden"
          }`}
        >
          <Incorrect />
          <Text className="font-PoppinsBold text-lg md:text-xl text-white">
            Incorrect!
          </Text>
        </View>

        {hasChecked && (
          <Text className="text-center text-white font-NunitoBold text-sm">
            {message}
          </Text>
        )}

        {choice && !hasChecked ? (
          <View className="w-2/3 mx-auto">
            <LevelContentBtn text="Check" onPress={handleBG} />
          </View>
        ) : (
          hasChecked && (
            <View className="w-2/3 mx-auto">
              <LevelContentBtn text="Next" onPress={onPress} />
            </View>
          )
        )}
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

export default FillTheGap;
