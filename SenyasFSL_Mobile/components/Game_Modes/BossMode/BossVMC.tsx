import { View, Text } from "react-native";
import React, { useState } from "react";
import VideoMC from "@/json_files/VideoMC.json";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "../GameBtns/LevelContentBtn";
import VideoMCBTN from "../GameBtns/VideoMCBTN";
import Inventory from "../../main_interface/Inventory";

interface BossViewMCProps {
  title: string;
  choices: ReadonlyArray<readonly [string, string]>;
  videoSources: readonly string[];
  correctAnswer: string;
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossViewMCProps: React.FC<BossViewMCProps> = ({
  title,
  choices,
  videoSources,
  correctAnswer,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false); // New state to track if "Check" was pressed
  const [opacity, setOpacity] = useState(100);

  const handleBG = () => {
    if (choice) {
      const result = choice === correctAnswer;
      setIsCorrect(choice === correctAnswer);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
      onAnswer(result);
    }
  };
  return (
    <View className="flex-1 relative items-center bg-white justify-start">
      <View className=" flex-row">
        {Array.from({ length: hearts }).map((_, idx) => (
          <Text key={idx} style={{ fontSize: 24, color: "red" }}>
            ❤️
          </Text>
        ))}
      </View>

      <Text className="text-center font-PoppinsBold my-2 text-2xl md:text-3xl">
        {title}
      </Text>

      <View className="w-2/3">
        {choices.map((_, index) => {
          return (
            <VideoMCBTN
              key={index}
              answer={choices[index]}
              isCorrect={choices[index][0] === correctAnswer}
              hasChecked={hasChecked}
              clicked={hasChecked}
              isSelected={choice === choices[index][0]}
              onPress={() => {
                if (!hasChecked) {
                  // Only allow selection if not checked yet
                  setChoice(choices[index][0]);
                }
              }}
              videoSource={videoSources[index]}
            />
          );
        })}
      </View>

      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked(!isClicked)}
          XpPotion={1}
          Bomb={0}
          Retry={2}
          Skip={1}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        <View
          className={`flex-row mx-auto justify-center items-center gap-2 ${isCorrect == null ? "hidden" : isCorrect === true ? "flex" : "hidden"}`}
        >
          <CorrectIcon />
          <Text className="font-PoppinsBold text-lg md:text-xl text-white">
            Correct!
          </Text>
        </View>

        <View
          className={`flex-row mx-auto justify-center items-center gap-2 ${isCorrect == null ? "hidden" : isCorrect === false ? "flex" : "hidden"}`}
        >
          <Incorrect />
          <Text className="font-PoppinsBold text-lg md:text-xl text-white">
            Incorrect!
          </Text>
        </View>

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleBG} />
        ) : (
          hasChecked && <LevelContentBtn text="Next" onPress={onPress} />
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

export default BossViewMCProps;
