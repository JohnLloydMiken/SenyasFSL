import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Streak from "@/assets/svgs/Streak.svg";
import Protection from "@/assets/svgs/Protection.svg";
interface streakProps {
  streakCount: number;
  protectionCount: number;
}

const UserStreak: React.FC<streakProps> = ({
  streakCount = 1,
  protectionCount = 1,
}) => {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[now.getDay()];
  const { width } = useWindowDimensions();
  const svgStreak = width < 768 ? 150 : 200;
  const svgProtection = width < 768 ? 35 : 50;
  return (
    <View className="w-11/12 p-2 bg-[#FAF3E0] rounded-2xl">
      {/*Streak Count*/}
      <View className=" w-1/2 absolute -top-2/3 left-[31%]">
        <View>
          <Streak width={svgStreak} height={svgStreak} />
        </View>
        <MaskedView
          style={{ zIndex: 50, position: "absolute", left: "43%", top: "70%" }}
          maskElement={
            <Text className="text-2xl font-PoppinsBold ">{streakCount}</Text>
          }
        >
          <LinearGradient
            colors={["#FB990F", "#EA0505"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
          >
            <Text
              style={{ opacity: 0 }}
              className="text-2xl font-PoppinsBold  "
            >
              {streakCount}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
      {/*Protection Count*/}
      <View className="flex-row justify-center items-center absolute right-3 top-3">
        <View>
          <Protection width={svgProtection} height={svgProtection} />
        </View>
        <MaskedView
          maskElement={
            <Text className="text-2xl font-PoppinsBold ">
              {protectionCount}
            </Text>
          }
        >
          <LinearGradient
            colors={["#2DE2E2", "#0922A0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
          >
            <Text
              style={{ opacity: 0 }}
              className="text-2xl font-PoppinsBold  "
            >
              {protectionCount}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <View className="mb-4 mt-10">
        <Text className="text-center font-PoppinsBold text-2xl md:text-3xl my-3">
          {streakCount} day streak!
        </Text>
        {/*Calendar Container */}
        <View className=" flex-row w-11/12 justify-between items-center mx-auto">
          {/*Monday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Monday" ? <Streak width={50} height={50} /> : null}
              </View>
            </View>
            {today === "Monday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Mo
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    Mo
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                Mo
              </Text>
            )}
          </View>

          {/*Tuesday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Tuesday" ? <Streak width={50} height={50} /> : null}
              </View>
            </View>
            {today === "Tuesday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Tu
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    TU
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                TU
              </Text>
            )}
          </View>

          {/*Wednesday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Wednesday" ? (
                  <Streak width={50} height={50} />
                ) : null}
              </View>
            </View>
            {today === "Wednesday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    We
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    We
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                We
              </Text>
            )}
          </View>

          {/*Thursday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Thursday" ? (
                  <Streak width={50} height={50} />
                ) : null}
              </View>
            </View>
            {today === "Thursday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Th
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    Th
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                Th
              </Text>
            )}
          </View>

          {/*Friday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Friday" ? <Streak width={50} height={50} /> : null}
              </View>
            </View>
            {today === "Friday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Fr
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    Fr
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                Fr
              </Text>
            )}
          </View>

          {/*Satruday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white relative">
              <View className="absolute -top-3 -left-3">
                {today === "Saturday" ? (
                  <Streak width={50} height={50} />
                ) : null}
              </View>
            </View>
            {today === "Saturday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Sa
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    Sa
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                Sa
              </Text>
            )}
          </View>

          {/*Sunday */}
          <View className="flex-col justify-center items-center">
            <View className="w-10 h-10 rounded-full border-[#FFC38B] border-2 bg-white">
              <View className="absolute -top-3 -left-3">
                {today === "Sunday" ? <Streak width={50} height={50} /> : null}
              </View>
            </View>
            {today === "Sunday" ? (
              <MaskedView
                maskElement={
                  <Text className="text-center text-xl font-PoppinsSemiBold">
                    Su
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  <Text
                    className="text-center text-xl font-PoppinsSemiBold"
                    style={{ opacity: 0 }}
                  >
                    Su
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                Su
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserStreak;

