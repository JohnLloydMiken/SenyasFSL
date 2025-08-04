import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn, { MultipleChoiceBTN } from "../LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
interface MultipleChoiceProps {
  videoUrl: any;
  title: string;
  correctAnswer: string;
  optionOne: string;
  optionOneFil: string;
  optoptionTwo: string;
  optionTwoFil: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  videoUrl,
  title,
  correctAnswer,
  optionOne,
  optionOneFil,
  optionTwoFil,
  optoptionTwo,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const videoSource = videoUrl;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const handleBG = () => {
    setIsCorrect(choice === correctAnswer);
  };

  return (
    <View className="flex-1 relative">
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold my-2">
        {title}
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

      <View className="w-11/12 mx-auto">
        <MultipleChoiceBTN
          id={1}
          EnglishText={optionOne}
          FilipinoText={`"${optionOneFil}"`}
          onPress={() => {
            setChoice(optionOne);
          }}
          clicked={choice === optionOne}
        />

        <MultipleChoiceBTN
          id={2}
          EnglishText={optoptionTwo}
          FilipinoText={`"${optoptionTwo}"`}
          onPress={() => {
            setChoice(optoptionTwo);
          }}
          clicked={choice === optoptionTwo}
        />
      </View>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect === true ? (
          <View className=" flex-row mx-auto justify-center items-center gap-2">
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">Correct!</Text>
          </View>
        ) : isCorrect === false ? (
          <View className=" flex-row mx-auto justify-center items-center gap-2">
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">Incorrect!</Text>
          </View>
        ) : null}
        <LevelContentBtn text="Check" onPress={handleBG} />
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
