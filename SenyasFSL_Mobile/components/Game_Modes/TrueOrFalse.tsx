import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn, { MCBTN } from "../LevelContent/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import Inventory from "../main_interface/Inventory";
import TOrF from "@/json_files/TrueOrFalse.json";
const TrueOrFalse = () => {
  const source = TOrF[0].TOFNum1;
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false); // New state to track if "Check" was pressed
  const [opacity, setOpacity] = useState(100);

  const videoSource = videoMap[source.VideSource];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === source.CorrectAnswer[0]);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
    }
  };
  return (
    <View className="flex-1 relative items-center">
      <View className="w-10/12">
        <Text className="font-PoppinsBold text-2xl md:text-3xl text-center">
          {" "}
          <Text className="text-[#FB990F]">{source.EngTitle}</Text>{" "}
          {source.EngQuestion}
        </Text>
        <Text className="font-PoppinsLightItallic text-lg text-center md:text-xl">
          {" "}
          <Text className="text-[#FB990F]">{source.FilTitle}</Text>{" "}
          {source.FilQuestion}
        </Text>
      </View>

      <View className="w-full h-56 flex-row items-center justify-around  ">
        <View className="w-48 h-36 relative  ">
          <VideoView
            style={{ width: "100%", height: "100%" }}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        </View>

        <View className="w-48 h-36 relative  ">
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
        {source.Options.map((_, index) => {
          return (
            <MCBTN
              key={index}
              EnglishText={source.Options[index][0]}
              FilipinoText={`"${source.Options[index][1]}"`}
              onPress={() => {
                if (!hasChecked) {
                  // Only allow selection if not checked yet
                  setChoice(source.Options[index][0]);
                }
              }}
              clicked={hasChecked} // Keep for backward compatibility
              isCorrect={source.Options[index][0] === source.CorrectAnswer[0]} // Each button knows if it's the correct answer
              isSelected={choice === source.Options[index][0]} // New prop: is this button selected
              hasChecked={hasChecked} // New prop: has check button been pressed
              rounded={50}
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
export default TrueOrFalse;
