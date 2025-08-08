import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import React from "react";
import { useState } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import ViDSelected from '@/assets/svgs/VidSelected.svg'
import ViDCorrect from '@/assets/svgs/VidCorrect.svg'
import VidWrong from '@/assets/svgs/VidWrong.svg'
interface ButtonProps {
  text: string;
  onPress: () => void;
}
interface LearnAsignBTNProps {
  EnglishText: string;
  FilipinoText: string;
  clicked: boolean;
  onPress: () => void;
}

interface MCBTNProps {
  EnglishText: string;
  FilipinoText: string;
  onPress: () => void;
  clicked: boolean; // Keep for backward compatibility
  isCorrect: boolean;
  isSelected: boolean; // New: is this specific button selected
  hasChecked: boolean; // New: has the check button been pressed
  rounded: number;
}

interface VideoMCBTNProps {
  answer: string[];
  videoSource: any;
  hasChecked: boolean;
  isCorrect: boolean;
  clicked: boolean;
  onPress: () => void;
  isSelected: boolean;
}

const LevelContentBtn: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: "100%",
        borderRadius: 50,
        backgroundColor: "trasnparent",
        elevation: 5,
      }}
    >
      {/* Invisible text only to preserve size */}
      <TouchableOpacity onPress={onPress} className="p-4">
        <Text className="font-PoppinsBold text-xl md:text-2xl text-center text-white">
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const LearnAsignBTN: React.FC<LearnAsignBTNProps> = ({
  EnglishText,
  FilipinoText,
  onPress,
  clicked,
}) => {
  return (
    <>
      {clicked === true ? (
        <LinearGradient
          colors={["#FB990F", "#EA0505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={{
            width: "100%",
            borderRadius: 50,
            backgroundColor: "trasnparent",
            elevation: 5,
            padding: 1,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {/* Invisible text only to preserve size */}
          <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-full w-full p-2"
          >
            {/* English Text */}
            <MaskedView
              maskElement={
                <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
                  {EnglishText}
                </Text>
              }
            >
              <LinearGradient
                colors={["#FB990F", "#EA0505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
              >
                {/* Invisible text only to preserve size */}
                <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center opacity-0">
                  {EnglishText}
                </Text>
              </LinearGradient>
            </MaskedView>

            {/* Filipino Text */}
            <MaskedView
              maskElement={
                <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] ">
                  {FilipinoText}
                </Text>
              }
            >
              <LinearGradient
                colors={["#FB990F", "#EA0505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
              >
                {/* Invisible text only to preserve size */}
                <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] opacity-0">
                  {FilipinoText}
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          className="w-full p-2 border border-[#F7D674] rounded-full my-3"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
            {EnglishText}
          </Text>
          <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] ">
            {FilipinoText}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export const MCBTN: React.FC<MCBTNProps> = ({
  EnglishText,
  FilipinoText,
  onPress,
  clicked,
  isCorrect,
  isSelected, // New prop to track if this specific button is selected
  hasChecked, // New prop to track if check button was pressed
  rounded
}) => {
  // State 1: Default (not selected, not checked)
  if (!isSelected && !hasChecked) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`w-full p-2 border bg-white border-[#F7D674] ${rounded && 'rounded-full'} my-3 z-50`}  
      >
        <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
          {EnglishText}
        </Text>
      {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
          {FilipinoText}
        </Text>}
      </TouchableOpacity>
    );
  }

  // State 2: Selected but not checked yet (orange gradient with MaskedView)
  if (isSelected && !hasChecked) {
    return (
      <LinearGradient
        colors={["#FB990F", "#EA0505"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 2,
          marginTop: 10,
          marginBottom: 10,
          zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className={`bg-white ${rounded && 'rounded-full'} w-full p-2`}
        >
          {/* English Text with MaskedView */}
          <MaskedView
            maskElement={
              <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
                {EnglishText}
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              {/* Invisible text only to preserve size */}
              <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center opacity-0">
                {EnglishText}
              </Text>
            </LinearGradient>
          </MaskedView>

          {/* Filipino Text with MaskedView */}
         {FilipinoText === "" ?  null :(
             <MaskedView
            maskElement={
              <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
                {FilipinoText}
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              {/* Invisible text only to preserve size */}
              <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] opacity-0">
                {FilipinoText}
              </Text>
            </LinearGradient>
          </MaskedView>
         )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // State 3a: Checked and correct (green gradient)
  if (hasChecked && isCorrect) {
    return (
      <LinearGradient
        colors={["#31F705", "#007D00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 1,
          marginTop: 10,
          marginBottom: 10,
           zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className=" rounded-full w-full p-2"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-white text-center">
            {EnglishText}
          </Text>
         {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-white">
          {FilipinoText}
        </Text>}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // State 3b: Checked and incorrect (red gradient)
  if (hasChecked && !isCorrect) {
    return (
      <LinearGradient
        colors={["#FF6A6C", "#A20000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 1,
          marginTop: 10,
          marginBottom: 10,
           zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className=" rounded-full w-full p-2"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-white text-center">
            {EnglishText}
          </Text>
          {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-white">
          {FilipinoText}
        </Text>}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // Default fallback (shouldn't reach here)
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full p-2 border border-[#F7D674] rounded-full my-3"
    >
      <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
        {EnglishText}
      </Text>
      <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
        {FilipinoText}
      </Text>
    </TouchableOpacity>
  );
};

export const VideoMCBTN: React.FC<VideoMCBTNProps> = ({
  answer,
  isCorrect,
  hasChecked,
  clicked,
  onPress,
  videoSource,
  isSelected,
}) => {
  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 34 : 50
  const vidSource = videoMap[videoSource];
  const player = useVideoPlayer(vidSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  const getColors = () =>{

    if (hasChecked){
      return isCorrect ? ["#31F705", "#007D00"] : ["#FF6A6C" , "#A20000"]
    }
    return isSelected ? ["#FB990F", "#EA0505"] : ["#7B7B7B", "#7B7B7B"]
  }
   const getIcons = () =>{

    if (hasChecked){
      return isCorrect ? <ViDCorrect width={svgSize} height={svgSize}/> : <VidWrong width={svgSize} height={svgSize}/>
    }
    return isSelected ? <ViDSelected width={svgSize} height={svgSize}/> : null
  }

  return (
    <LinearGradient
      colors={getColors() as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: "100%",
        height: 216,
        borderRadius: 16,
        backgroundColor: "transparent",
        elevation: 5,
        padding: 1,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        className="w-full   relative overflow-hidden flex items-center justify-center "
        onPress={onPress}
      >
        <VideoView
          style={{ width: "98%", height: "100%", borderRadius: 16 }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        <View
          className={`bg-white/60 w-[98%] p-4 absolute bottom-0 ${hasChecked && "opacity-100"} opacity-0 rounded-xl`}
        >
          <Text className="text-sm text-center font-PoppinsRegular">
            {answer[0]}
          </Text>
          <Text className="text-sm text-center font-PoppinsRegular">
            {`"${answer[1]}"`}
          </Text>
        </View>

      <LinearGradient
      colors={getColors() as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: 45,
        height: 45,
        borderRadius: 6,
        backgroundColor: "transparent",
        padding: 3,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        right: 12,
        top: 12
      }}
    >
        <View
          className={`w-full h-full  rounded-md absolute bg-white flex justify-center items-center`}
        >
          {getIcons() }
        </View>
    </LinearGradient>

        
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LevelContentBtn;
const videoMap: Record<string, any> = {
  "FSL_A.mp4": require("@/assets/videos/FSL_A.mp4"),
};
