import { View, Text } from "react-native";
import React, { useState, useMemo } from "react";
// import VideoMC from "@/json_files/VideoMC.json"; // No longer needed
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import VideoMCBTN from "./GameBtns/VideoMCBTN";
import Inventory from "@/components/main_interface/Inventory";

// 1. Define and export an interface for the option object
export interface VideoQuestionOption {
  id: string;
  incorrect: boolean;
  labelEn: string;
  labelFil: string;
  videoURL: string; // This must be the HTTPS download URL
}

// 2. Update the ViewMCProps interface
interface ViewMCProps {
  enPrompt: string,
  filPrompt: string
  options: readonly VideoQuestionOption[]; // Replaced old props
  onPress: () => void;
}

const ViewMC: React.FC<ViewMCProps> = ({ enPrompt, filPrompt, options, onPress }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null); // Will store labelEn
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);

  // 3. Derive the correct answer from the options prop
  const correctAnswer = useMemo(() => {
    const correctOption = options.find((opt) => opt.incorrect === false);
    return correctOption ? correctOption.labelEn : ""; // Check against English label
  }, [options]);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === correctAnswer);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
    }
  };

  return (
    <View className="flex-1 relative items-center bg-white">
      <Text className="text-center font-PoppinsBold my-2 text-xl md:text-3xl">
        {enPrompt}
      </Text>
      <Text className="text-center font-PoppinsLightItallic my-2 text-lg md:text-3xl">
        {filPrompt}
      </Text>

      <View className="w-2/3">
        {/* 4. Map over the new 'options' prop */}
        {options.map((option) => {
          return (
            <VideoMCBTN
              key={option.id} // Use the option's ID as the key
              answer={[option.labelEn, option.labelFil]} // Create the array VideoMCBTN expects
              isCorrect={option.labelEn === correctAnswer}
              hasChecked={hasChecked}
              clicked={hasChecked}
              isSelected={choice === option.labelEn}
              onPress={() => {
                if (!hasChecked) {
                  setChoice(option.labelEn); // Set choice to the English label
                }
              }}
              videoSource={option.videoURL} // Use the videoURL from the option
            />
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

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        <View
          className={`flex-row mx-auto justify-center items-center gap-2 ${
            isCorrect == null ? "hidden" : isCorrect === true ? "flex" : "hidden"
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

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleBG} />
        ) : (
          hasChecked && (
            <LevelContentBtn text="Next" onPress={onPress} />
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

export default ViewMC;