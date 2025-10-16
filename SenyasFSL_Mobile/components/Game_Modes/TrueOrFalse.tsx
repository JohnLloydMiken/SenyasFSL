import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import MCBTN from "./GameBtns/MCBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import Inventory from "../main_interface/Inventory";
import { fslLetterMap } from "@/utils/assetsMap";

interface TrueOrFalseProps {
  title: readonly string[];
  question: readonly string[];
  videoSource: string;
  choices: ReadonlyArray<readonly [string, string]>;
  correctAnswer: string;
  onPress: () => void;
}

const TrueOrFalse: React.FC<TrueOrFalseProps> = ({
  title,
  question,
  videoSource,
  choices,
  correctAnswer,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(1); // use number between 0–1 for style

  const player = useVideoPlayer(fslLetterMap[videoSource], (p) => {
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
      {/* Question */}
      <View className="w-10/12">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          <Text className="text-[#FB990F]">{title[0]}</Text> {question[0]}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          <Text className="text-[#FB990F]">{title[1]}</Text> {question[1]}
        </Text>
      </View>

      {/* Video Section */}
      <View className="w-full h-56 flex-row items-center justify-around">
       
          <View  className="w-48 h-36">
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          </View>

          <View  className="w-48 h-36">
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
              
            />
          </View>
      
      </View>

      {/* Choices */}
      <View className="w-11/12 mx-auto">
        {choices.map(([eng, fil], index) => (
          <MCBTN
            key={index}
            EnglishText={eng}
            FilipinoText={`"${fil}"`}
            onPress={() => !hasChecked && setSelectedChoice(eng)}
            clicked={hasChecked}
            isCorrect={eng === correctAnswer}
            isSelected={selectedChoice === eng}
            hasChecked={hasChecked}
            rounded={50}
          />
        ))}
      </View>

      {/* Inventory */}
      <View style={{ opacity }} className="w-full p-4 mx-auto absolute bottom-28 z-50">
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* Feedback & Actions */}
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

      {/* Backgrounds */}
      <View className="absolute w-full bottom-0 z-10">
        {isCorrect === true ? <CorrectBG /> : isCorrect === false ? <WrongBG /> : <LevelBg />}
      </View>
    </View>
  );
};

export default TrueOrFalse;
