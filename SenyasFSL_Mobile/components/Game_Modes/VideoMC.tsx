import { View, Text } from "react-native";
import React, { useState } from "react";
import VideoMC from "@/json_files/VideoMC.json";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn, { VideoMCBTN } from "../LevelContentBtn";
import Inventory from "../Inventory";
const ViewMC = () => {
  const source = VideoMC[0].VideoMCNum1;
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false); // New state to track if "Check" was pressed
  const [opacity, setOpacity] = useState(100);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === source.correctAnswer[0]);
      setHasChecked(true); // Mark that check button was pressed
      setOpacity(0);
    }
  };
  return (
    <View className="flex-1 relative items-center">
      <Text className="text-center font-PoppinsBold my-2 text-2xl md:text-3xl">
        {source.title}
      </Text>

      <View className="w-11/12">
        {source.option.map((_, index) => {
          return (
            <VideoMCBTN
              key={index}
              answer={source.correctAnswer}
              isCorrect={source.option[index][0] === source.correctAnswer[0]}
              hasChecked={hasChecked}
              clicked={hasChecked}
              isSelected={choice === source.option[index][0]}
              onPress={() => {
                if (!hasChecked) {
                  // Only allow selection if not checked yet
                  setChoice(source.option[index][0]);
                }
              }}
              videoSource={source.videoSources[index]}
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
       
          <View className= {`flex-row mx-auto justify-center items-center gap-2 ${isCorrect ==  null ? 'opacity-0': 'opacity-100'}`}>
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Correct!
            </Text>
          </View>
    
          <View className= {`flex-row mx-auto justify-center items-center gap-2 ${isCorrect ==  null ? 'opacity-0': 'opacity-100'}`}>
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Incorrect!
            </Text>
          </View>
    

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

export default ViewMC;
