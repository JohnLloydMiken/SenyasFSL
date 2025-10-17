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

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  enPrompt,
  filPrompt,
  videoUrl,
  options,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<Option | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const handleCheck = () => {
    if (choice) {
      setIsCorrect(choice.isCorrect);
      setHasChecked(true);
      setOpacity(0);
    }
  };

  return (
    <View className="flex-1 relative bg-white">
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold my-2">
        {enPrompt}
      </Text>
      <Text className="text-center text-xl md:text-2xl font-PoppinsLightItalic my-2">
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
      </View>

      <View className="w-11/12 mx-auto mt-4">
        {options.map((item, index) => (
          <MCBTN
            key={index}
            EnglishText={item.labelEn}
            FilipinoText={item.labelFil}
            onPress={() => {
              if (!hasChecked) setChoice(item);
            }}
            clicked={hasChecked}
            isCorrect={item.isCorrect}
            isSelected={choice?.id === item.id}
            hasChecked={hasChecked}
            rounded={50}
          />
        ))}
      </View>

      <View className={`w-full p-4 mx-auto absolute bottom-20 z-50 opacity-${opacity}`}>
        <Inventory
          onPress={() => setIsClicked(!isClicked)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect === true ? (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Correct!
            </Text>
          </View>
        ) : isCorrect === false ? (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Incorrect!
            </Text>
          </View>
        ) : null}

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleCheck} />
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

export default MultipleChoice;
