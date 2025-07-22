import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import React from "react";
import LevelHeader from "@/components/levelHeader";
import BG from "@/assets/svgs/bg 1.svg";
import Tutorial from "@/assets/svgs/Tutorial.svg";
import Settings from "@/components/Settings";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Sound from "@/assets/svgs/sound.svg";
import Music from "@/assets/svgs/Music.svg";
export default function index() {
  const [context, setContext] = useState(tutorial[0])
  const [index, setIndex] = useState(0)
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);
  const [Soundvalue, setSoundValue] = useState(100);
  const [Musicvalue, setMusicValue] = useState(100);
  const [sliderSoundWidth, setSliderSoundWidth] = useState(0);
  const [sliderMusicWidth, setSliderMusicWidth] = useState(0);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const svgBG = width < 768 ? 60 : 80;

  const handleSoundLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderSoundWidth(width);
  };
  const handleMusicLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderMusicWidth(width);
  };
  const showTutorial = (index: number)=>{
        setContext(tutorial[index])
        setIndex(index)

        if (index === tutorial.length) {
          setTutorialPressed(!tutorialPressed)
            setIndex(0)
              setContext(tutorial[0])
        }
  }

  const SoundIconPosition = (sliderSoundWidth * Soundvalue) / 115 - svgSize / 2;
  const MusicIconPosition = (sliderMusicWidth * Musicvalue) / 115 - svgSize / 2;
  return (
    <View className="bg-white flex-1 items-center ">
      <View className="w-full h-full absolute top-0 left-0 ">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>
      <LevelHeader title="Learn The Alphabets" section={1} level={1} />

      <View className="flex-col justify-center items-center absolute bottom-2 left-2 gap-2">
        <TouchableOpacity onPress={()=> setTutorialPressed(!tutorialPressed)}>
          <Tutorial />
        </TouchableOpacity>

        <Settings onPress={() => setIsPressed(!isPressed)} />
      </View>

      {isPressed || tutorialPressed && (
        <View className="absolute w-full h-full left-0 top-0 bottom-0 right-0 bg-black/60 z-40"></View>
      )}
      {isPressed && (
        <LinearGradient
          colors={["#FB990F", "#EA0505"]} // orange to red
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 3, // This controls the thickness of the border
            width: "90%",
            backgroundColor: "transparent",
            elevation: 5,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
          }}
        >
          <View className="bg-[#FFFBF1] p-4 rounded-2xl gap-3">
            <View className=" border-b-2 border-b-[#757F7F] w-full flex-row items-center justify-center">
              <MaskedView
                maskElement={
                  <Text className="font-PoppinsBold text-2xl md:text-3xl mb-2">
                    Audio
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  {/* Invisible text only to preserve size */}
                  <Text
                    style={{ opacity: 0 }}
                    className="font-PoppinsBold text-2xl md:text-3xl mb-2"
                  >
                    {" "}
                    Audio
                  </Text>
                </LinearGradient>
              </MaskedView>

              <TouchableOpacity
                onPress={() => setIsPressed(!isPressed)}
                className="absolute right-0 top-0"
              >
                <MaskedView
                  maskElement={
                    <Ionicons name="close" size={40} color="black" />
                  }
                >
                  <LinearGradient
                    colors={["#FB990F", "#EA0505"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: 40, height: 40 }} // same size as the icon
                  />
                </MaskedView>
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              <Text className="text-[#646464] font-PoppinsSemiBold text-2xl md:text-3xl">
                Sound effects
              </Text>
              <View style={styles.container} onLayout={handleSoundLayout}>
                <Text
                  className={`text-xl md:text-2xl font-PoppinsSemiBold absolute text-[#646464] z-50 bottom-20 right-0 `}
                >
                  {Soundvalue.toFixed()}%
                </Text>
                <LinearGradient
                  colors={["#2DE2E2", "#0922A0"]}
                  start={{ x: 0, y: -0.1 }}
                  end={{ x: 0, y: 0.9 }}
                  style={styles.gradientTrack}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={Soundvalue}
                  onValueChange={setSoundValue}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="transparent"
                />
                {sliderSoundWidth > 0 && (
                  <>
                    <LinearGradient
                      colors={["#2DE2E2", "#0922A0"]}
                      start={{ x: 0, y: -0.1 }}
                      end={{ x: 0, y: 0.9 }}
                      style={{
                        padding: 16,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        width: svgBG,
                        height: svgBG,
                        left: SoundIconPosition,
                        top: -15,
                      }}
                    >
                      <Sound width={svgSize} height={svgSize} />
                    </LinearGradient>
                  </>
                )}
              </View>
            </View>

            <View className="gap-6">
              <Text className="text-[#646464] font-PoppinsSemiBold text-2xl md:text-3xl">
                Music
              </Text>
              <View style={styles.container} onLayout={handleMusicLayout}>
                <Text
                  className={`text-xl md:text-2xl font-PoppinsSemiBold absolute text-[#646464] z-50 bottom-20 right-0 `}
                >
                  {Musicvalue.toFixed()}%
                </Text>
                <LinearGradient
                  colors={["#2DE2E2", "#0922A0"]}
                  start={{ x: 0, y: -0.1 }}
                  end={{ x: 0, y: 0.9 }}
                  style={styles.gradientTrack}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={Musicvalue}
                  onValueChange={setMusicValue}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="transparent"
                />
                {sliderMusicWidth > 0 && (
                  <>
                    <LinearGradient
                      colors={["#2DE2E2", "#0922A0"]}
                      start={{ x: 0, y: -0.1 }}
                      end={{ x: 0, y: 0.9 }}
                      style={{
                        padding: 16,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        width: svgBG,
                        height: svgBG,
                        left: MusicIconPosition,
                        top: -15,
                      }}
                    >
                      <Music width={svgSize} height={svgSize} />
                    </LinearGradient>
                  </>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      )}

      {tutorialPressed && (
        <View className="w-11/12 rounded-2xl z-50 bg-[#FB990F] absolute bottom-5">
            <View className="w-full p-4 border-b-2 border-b-white/20 flex-row items-center justify-center">
              <Text className="font-PoppinsBold text-center text-2xl md:text-3xl text-white">
                Tutorial
              </Text>
              <TouchableOpacity onPress={()=> setTutorialPressed(!tutorialPressed)} className="absolute right-4 top-4 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center p-2 bg-[#D5800A] rounded-full">
                <Ionicons name= "close" color={'white'} />
              </TouchableOpacity>
            </View>
            <View className="w-full p-4">
              <Text className="text-center font-PoppinsRegular text-white text-2xl md:text-3xl">{context}</Text>
            </View>

            <TouchableOpacity className="w-2/5 mx-auto my-4 rounded-xl p-4 border border-white" onPress={() => showTutorial(index + 1)}>
              <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
                OK
              </Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  gradientTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    height: 10,
    marginHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    position: "absolute",
    top: -15,
  },
});

const tutorial = [
  "You can change tabs using the navigation bar below ",
  "The star on the corner left above is the currency you can use to buy items (Can be acquired through playing)",
  "On the corner right above, it consists of Achievements, Leaderboard, and Current Streak."
]
