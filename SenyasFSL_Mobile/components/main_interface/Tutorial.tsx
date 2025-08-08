import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface TutorialProps{
    onPress: ()=> void
}

 const Tutorial: React.FC<TutorialProps> =({onPress}) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const [context, setContext] = useState(tutorial[0]);
  const [index, setIndex] = useState(0);


  const showTutorial = (index: number) => {
    setContext(tutorial[index]);
    setIndex(index);

    if (index === tutorial.length) {
        
      setIndex(0);
      setContext(tutorial[0]);
    }
  };
  return (
    <View className="w-11/12 rounded-2xl z-50 bg-[#FB990F] absolute bottom-5">
      <View className="w-full p-4 border-b-2 border-b-white/20 flex-row items-center justify-center">
        <Text className="font-PoppinsBold text-center text-2xl md:text-3xl text-white">
          Tutorial
        </Text>
        <TouchableOpacity
          onPress={onPress}
          className="absolute right-4 top-4 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center p-2 bg-[#D5800A] rounded-full"
        >
          <Ionicons name="close" color={"white"} />
        </TouchableOpacity>
      </View>
      <View className="w-full p-4">
        <Text className="text-center font-PoppinsRegular text-white text-2xl md:text-3xl">
          {context}
        </Text>
      </View>

      <TouchableOpacity
        className="w-2/5 mx-auto my-4 rounded-xl p-4 border border-white"
        onPress={() => showTutorial(index + 1)}
      >
        <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
          OK
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Tutorial
const tutorial = [
  "You can change tabs using the navigation bar below ",
  "The star on the corner left above is the currency you can use to buy items (Can be acquired through playing)",
  "On the corner right above, it consists of Achievements, Leaderboard, and Current Streak.",
];



const styles = StyleSheet.create({});
