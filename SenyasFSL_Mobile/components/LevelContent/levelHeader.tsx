import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import Book from "@/assets/svgs/A-Z.svg";
import Numbers from "@/assets/svgs/Numbers.svg"
import Social from "@/assets/svgs/Social.svg"
import Family from "@/assets/svgs/Families.svg"
import Time from "@/assets/svgs/Clock.svg"
import Calendar from "@/assets/svgs/Calendar.svg"
import Weather from "@/assets/svgs/Weather.svg"
import Colors from "@/assets/svgs/Colors.svg"
import Occupation from "@/assets/svgs/Jobs.svg"
import Places from "@/assets/svgs/Places.svg"
import { SectionHeaderProps } from "@/modules/types/interface";
import { SvgProps } from "react-native-svg";
const levelHeader: React.FC<SectionHeaderProps> = ({
  title,
  section,
  level,
}) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const height = width < 768 ? 70 : 200;

  const SectionIcon: { [key: number]: React.ComponentType<SvgProps> } = {
  1: Book,
  2: Numbers,
  3: Social,
  4: Family,
  5: Time,
  6: Calendar,
  7: Weather,
  8: Colors,
  9: Occupation,
  10: Places
};

const IconComponent = SectionIcon[section]
  return (
    <LinearGradient
      colors={["#41BABA", "#3E58D9"]} // orange to red
      start={{ x: 0, y: -0.1 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        borderRadius: 12,
        padding: 8, // This controls the thickness of the border
        width: "95%",
        height: height,
        backgroundColor: "white",
        elevation: 15,
        shadowColor: "black",
        marginHorizontal: "auto",
      }}
    >
      <View className="w-full flex-row justify-between items-center  h-full">
        <View>
          <Text className="text-white text-lg md:text-xl font-PoppinsMedium">
            Section {section}, Level {level}
          </Text>
          <Text className="text-white text-lg md:text-2xl font-PoppinsBold">
            {title}
          </Text>
        </View>
        <View>
          <IconComponent width={svgSize} height={svgSize} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

export default levelHeader;
