import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn, { MCBTN } from "../LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import MCContent from "@/json_files/MutlipleChoiceContent.json";
import Inventory from "../Inventory";

interface MultipleChoiceProps {
  title: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ title }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false); // New state to track if "Check" was pressed
  const [opacity, setOpacity] = useState(100);
  const source = MCContent[0].MCNum1;
  const videoSource = videoMap[source.question];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === source.correctAnswer);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
    }
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
        <View
          className={`bg-white/60 w-full p-4 absolute bottom-0 ${hasChecked && "opacity-100"} opacity-0`}
        >
          <Text className="text-sm text-center font-PoppinsRegular">
            {source.correctAnswer}
          </Text>
        </View>
      </View>

      <View className="w-11/12 mx-auto ">
        {source.options.map((item, index) => {
          return (
            <MCBTN
              key={index}
              EnglishText={source.options[index][0]}
              FilipinoText={`"${source.options[index][1]}"`}
              onPress={() => {
                if (!hasChecked) {
                  // Only allow selection if not checked yet
                  setChoice(source.options[index][0]);
                }
              }}
              clicked={hasChecked} // Keep for backward compatibility
              isCorrect={source.options[index][0] === source.correctAnswer} // Each button knows if it's the correct answer
              isSelected={choice === source.options[index][0]} // New prop: is this button selected
              hasChecked={hasChecked} // New prop: has check button been pressed
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
        {isCorrect === true ? (
          <View className=" flex-row mx-auto justify-center items-center gap-2">
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Correct!
            </Text>
          </View>
        ) : isCorrect === false ? (
          <View className=" flex-row mx-auto justify-center items-center gap-2">
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Incorrect!
            </Text>
          </View>
        ) : null}

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleBG} />
        ) : (
          hasChecked && (
            <LevelContentBtn
              text="Next"
              onPress={() => console.log("clicked")}
            />
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

const videoMap: Record<string, any> = {
  "FSL_A.mp4": require("@/assets/videos/FSL_A.mp4"),
};

export default MultipleChoice;
