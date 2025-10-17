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
// import { fslLetterMap } from "@/utils/assetsMap"; // No longer needed

// 1. Define and export the Option type
export interface TrueFalseOption {
  id: string;
  incorrect: boolean;
  labelEn: string;
  labelFil: string;
}

// 2. Update the props interface
interface TrueOrFalseProps {
  enQuestion: string;   // Was 'title' and 'question' arrays
  filQuestion: string;  // Was 'title' and 'question' arrays
  videoURL: string;     // Was 'videoSource', this must be an https:// URL
  options: readonly TrueFalseOption[]; // Was 'choices' array of tuples
  onPress: () => void;
  // 'correctAnswer' prop removed, will be derived from options
}

const TrueOrFalse: React.FC<TrueOrFalseProps> = ({
  enQuestion,
  filQuestion,
  videoURL,
  options,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null); // Will store "True" or "False"
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // 3. Derive the correct answer from the options prop
  const correctAnswer = useMemo(() => {
    const correctOpt = options.find(opt => opt.incorrect === false);
    return correctOpt ? correctOpt.labelEn : ""; // This will be "True"
  }, [options]);

  // 4. Use the videoURL prop directly
  const player = useVideoPlayer(videoURL, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const handleCheck = () => {
    if (selectedChoice) {
      setIsCorrect(selectedChoice === correctAnswer);
      setHasChecked(true);
      setOpacity(0);
    }
  };

  return (
    <View className="flex-1 relative items-center bg-white">
      {/* 5. Update Question section */}
      <View className="w-10/12">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          {filQuestion}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          {enQuestion}
        </Text>
      </View>

      {/* 6. Update Video Section - now shows one centered video */}
      <View className="w-full h-56 flex-row items-center justify-center">
        <View className="w-48 h-36">
          <VideoView
            style={{ width: "100%", height: "100%" }}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        </View>
        {/* Removed the second video player */}
      </View>

      {/* 7. Update Choices section to map 'options' */}
      <View className="w-11/12 mx-auto">
        {options.map((option) => (
          <MCBTN
            key={option.id}
            EnglishText={option.labelEn}
            FilipinoText={`"${option.labelFil}"`}
            onPress={() => !hasChecked && setSelectedChoice(option.labelEn)}
            clicked={hasChecked}
            isCorrect={option.labelEn === correctAnswer}
            isSelected={selectedChoice === option.labelEn}
            hasChecked={hasChecked}
            rounded={50}
          />
        ))}
      </View>

      {/* Inventory */}
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

      {/* Feedback & Actions (This section is fine, no changes needed) */}
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

      {/* Backgrounds (This section is fine, no changes needed) */}
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