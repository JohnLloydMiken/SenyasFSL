import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
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
import Music from '@/assets/svgs/Music.svg'
export default function index() {
  const [isPressed, setIsPressed] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  return (
    <View className="bg-white flex-1 items-center ">
      <View className="w-full h-full absolute top-0 left-0 ">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>
      <LevelHeader title="Learn The Alphabets" section={1} level={1} />

      <View className="flex-col justify-center items-center absolute bottom-2 left-2 gap-2">
        <TouchableOpacity>
          <Tutorial />
        </TouchableOpacity>

        <Settings onPress={() => setIsPressed(!isPressed)} />
      </View>

      {isPressed && (
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
          <View className="bg-[#FFFBF1] p-4 rounded-2xl ">
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

            <View>
              <Text className="text-[#646464] font-PoppinsSemiBold text-2xl md:text-3xl">Sound effects</Text>
           <Slider
  style={{ width: '100%', height: 60 }}
  value={sliderValue}
  onValueChange={setSliderValue}
  minimumValue={0}
  maximumValue={100}
  minimumTrackTintColor="#FB990F"
  maximumTrackTintColor="#ccc"
  thumbTintColor="blue"
/>
<View style={{
  position: 'absolute',
  left: `${sliderValue}%`, // simplified, may need pixel math
  top: 0,
}}>
  <Music width={30} height={30} />
</View>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
