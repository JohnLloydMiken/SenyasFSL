import { View, Text } from "react-native";
import React from "react";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import LevelContentBtn from "../GameBtns/LevelContentBtn";

// ✅ Define the shape of the instruction data from your database
interface InstructionData {
  title: string;
  subtitle: string;
  instructionsEn: string[];
  instructionsFil: string[];
  reminder: string;
}

interface InstructionProps {
  onPress: () => void;
  data: InstructionData; // ✅ Expect a 'data' prop
}

const Instruction: React.FC<InstructionProps> = ({ onPress, data }) => {
  return (
    <View className="flex-1 bg-white justify-start items-center">
      <View className="flex bg-white justify-start items-center gap-4 p-4 min-h-20 mb-5">
        {/* ✅ Use data from props */}
        <Text className="font-PoppinsBold text-3xl md:text-4xl text-orange-400">
          {data.title}
        </Text>
        <Text className="font-PoppinsBold text-7xl text-center md:text-8xl">
          {data.subtitle}
        </Text>
        <Text className="self-start font-PoppinsBold text-2xl md:text-3xl">
          How it works?
        </Text>
        
        {/* ✅ Map over the instructions array to display each one */}
        {data.instructionsEn.map((instruction, index) => (
          <Text
            key={index}
            className="font-PoppinsMedium text-lg md:text-2xl text-justify"
          >
            • {instruction}
          </Text>
        ))}
      </View>

      <Text className="text-center text-red-600 font-PoppinsBold text-xl md:text-3xl">
        Reminder: {data.reminder}
      </Text>

      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50">
        <LevelContentBtn text="Start" onPress={onPress} />
      </View>

      <View className="absolute w-full bottom-0 z-10">
        <LevelBg />
      </View>
    </View>
  );
};

export default Instruction;