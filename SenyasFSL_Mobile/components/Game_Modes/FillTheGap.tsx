import { View, Text } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn, { MCBTN } from "../LevelContent/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import MCContent from "@/json_files/MutlipleChoiceContent.json";
import Inventory from "../main_interface/Inventory";
import FTG_data from "@/json_files/FillTheGap.json";
import { LinearGradient } from "expo-linear-gradient";

const FillTheGap = () => {
  const source = FTG_data[0].FillNum1;
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false); // New state to track if "Check" was pressed
  const [opacity, setOpacity] = useState(100);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === source.corrrectAnswer);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
    }
  };
  const videoSource = videoMap[source.videoSource];
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });
  return (
    <View className="flex-1 relataive items-center">
      <Text className="font-PoppinsBold text-2xl md:text-3xl">
        {source.title}
      </Text>

      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View className={`bg-white/60 w-full p-4 absolute bottom-0  opacity-0`}>
          <Text className="text-sm text-center font-PoppinsRegular">
            {source.corrrectAnswer}
          </Text>
        </View>
      </View>

      <View className="w-11/12 rounded-md border border-[#F7D674] p-4 flex-col justify-center items-center">
        <Text className="text-center font-PoppinsSemiBold text-lg md:text-xl">
          {source.question}
        </Text>
        {hasChecked === true ? (<LinearGradient
          colors={hasChecked === true && isCorrect === true ? ["#31F705", "#007D00"] : ["#FF6A6C", "#A20000"]}
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
        </LinearGradient>):  <View className="w-16 h-10 bg-gray-400"></View>}
        
      
      </View>

      <View className="w-full relative   flex-row justify-center items-center gap-10 mt-2 ">
        {source.options.map((_, index) => {
          return (
            <View className="w-1/4   " key={index}>
              <View className={`${hasChecked === true && choice === source.options[index] ? "opacity-0" : "opacity-100"} `}>
                <MCBTN
                  EnglishText={source.options[index]}
                  rounded={6}
                  FilipinoText=""
                  hasChecked={hasChecked}
                  isCorrect={source.options[index] === source.corrrectAnswer}
                  isSelected={choice === source.options[index]}
                  onPress={() => {
                    if (!hasChecked) {
                      // Only allow selection if not checked yet
                      setChoice(source.options[index]);
                    }
                  }}
                  clicked={hasChecked}
                />
              </View>
              <View
                className={`absolute w-28 rounded-md h-10 left-1/2 top-1/2 bg-[#E6E6E6] z-0 -translate-x-1/2 -translate-y-1/2`}
              ></View>
            </View>
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

      <View className="absolute bottom-6 w-96 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2 ">
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

       {hasChecked && <Text className="text-center text-white font-NunitoBold text-sm">{source.message}</Text>}

        {choice && !hasChecked ? (
        <View className="w-2/3 mx-auto"><LevelContentBtn text="Check" onPress={handleBG} /></View>
        ) : (
          hasChecked && (
           <View className="w-2/3 mx-auto">
             <LevelContentBtn
              text="Next"
              onPress={() => console.log("clicked")}
            />
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

const videoMap: Record<string, any> = {
  "FSL_A.mp4": require("@/assets/videos/FSL_A.mp4"),
};

export default FillTheGap;
