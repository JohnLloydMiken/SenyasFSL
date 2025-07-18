import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import Leaderboards from "@/json_files/leaderboards.json";
import RestStar from "@/assets/svgs/restStar.svg";
import Top3Star from "@/assets/svgs/top3Star.svg";
export default function leaderboards() {
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const topThree = Leaderboards.slice(0, 3);
  const rest = Leaderboards.slice(3);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 20 : 30;
  return (
    <LinearGradient
      colors={["#2DE2E2", "#0922A0"]} // blue shades top to bottom
      style={{ flex: 1, position: "relative" }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View className="w-11/12 md:p-6 p-4 flex flex-row justify-between md:justify-around items-center bg-[#672F00]  rounded-xl mx-auto my-4">
        <TouchableOpacity onPress={() => setSelected("daily")}>
          <Text
            className={` ${selected === "daily" ? "underline underline-offset-8 text-2xl md:text-3xl font-PoppinsBold text-white" : "text-2xl md:text-3xl font-PoppinsBold text-white"}`}
          >
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected("weekly")}>
          <Text
            className={` ${selected === "weekly" ? "underline underline-offset-8 text-2xl md:text-3xl font-PoppinsBold text-white" : "text-2xl md:text-3xl font-PoppinsBold text-white"}`}
          >
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected("monthly")}>
          <Text
            className={` ${selected === "monthly" ? "underline underline-offset-8 text-2xl md:text-3xl font-PoppinsBold text-white" : "text-2xl  md:text-3xl font-PoppinsBold text-white"}`}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-11/12 mx-auto my-4 p-4 ">
        <View className="w-11/12 flex flex-row justify-center items-end mx-auto my-0">
          {/* Top2*/}
          <View className="flex- flex-col items-center justify-end w-1/3 gap-10">
            <View className="w-full">
              <Text className="text-3xl md:text-4xl font-PoppinsBold text-white text-center">
                {topThree[1].name.toString()}
              </Text>
              <View className="flex flex-row justify-start md:justify-center items-center  bg-[#A84C00] w-10/12 rounded-3xl p-2 mx-auto my-0 gap-4">
                <Top3Star width={svgSize} height={svgSize} />
                <Text className="text-sm md:text-lg text-white font-PoppinsRegular">
                  {topThree[1].score}
                </Text>
              </View>
            </View>

            <View className="bg-[#FB990F] h-28 w-full">
              <Text className="text-4xl text-white font-PoppinsBold mx-auto my-4">
                {topThree[1].rank}
              </Text>
            </View>
          </View>
          {/* Top1*/}

          <View className="flex- flex-col items-center justify-end w-1/3 gap-10">
            <View className="w-full">
              <Text className="text-3xl md:text-4xl font-PoppinsBold text-white text-center">
                {topThree[0].name.toString()}
              </Text>
              <View className="flex flex-row justify-start items-center md:justify-center bg-[#A84C00] w-10/12 rounded-3xl p-2 mx-auto my-0 gap-4">
                <Top3Star width={svgSize} height={svgSize} />
                <Text className="text-sm text-white font-PoppinsRegular md:text-lg">
                  {topThree[0].score}
                </Text>
              </View>
            </View>

            <View className="bg-[#FBAB0F] h-40 w-full ">
              <Text className="text-4xl text-white font-PoppinsBold mx-auto my-4">
                {topThree[0].rank}
              </Text>
            </View>
          </View>
          {/* Top3*/}

          <View className="flex- flex-col items-center justify-end w-1/3 gap-10">
            <View className="w-full">
              <Text className="text-3xl md:text-4xl font-PoppinsBold text-white text-center ">
                {topThree[2].name.toString()}
              </Text>
              <View className="flex flex-row justify-start items-center md:justify-center bg-[#A84C00] w-10/12 rounded-3xl p-2 mx-auto my-0 gap-4">
                <Top3Star width={svgSize} height={svgSize} />
                <Text className="text-sm md:text-lg text-white font-PoppinsRegular">
                  {topThree[2].score}
                </Text>
              </View>
            </View>

            <View className="bg-[#FB790F] h-20 w-full">
              <Text className="text-4xl text-white font-PoppinsBold mx-auto my-4">
                {topThree[2].rank}
              </Text>
            </View>
          </View>
        </View>

        {/* Top 4 -10*/}
        <View className="bg-white p-8 w-full rounded-xl h-full">
          <FlatList
            data={rest}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                className={`w-full flex flex-row justify-between items-center mb-5 md:my-5`}
              >
                <Text className="font-PoppinsRegular text-lg md:text-2xl">
                  {item.rank}
                </Text>
                <Text className="font-PoppinsRegular text-lg md:text2-xl">
                  {item.name}
                </Text>
                <View className="p-2 rounded-3xl bg-[#FAF3E0] flex flex-row justify-start gap-3 items-center md:justify-center w-1/3 h-full">
                  <RestStar width={svgSize} height={svgSize} />
                  <Text className="font-PoppinsBold text-lg text-[#FB790F] md:text-2xl">
                    {item.score}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
