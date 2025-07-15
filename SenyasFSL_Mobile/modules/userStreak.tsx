import { View, Text, Image } from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
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

  return (
    <View className="bg-[#FAF3E0] w-full rounded-xl p-8  relative ">
      <View className="absolute left-[38%] -top-28 z-0">
        <Image
          source={require("../assets/images/fire.png")}
          className="w-40 h-40  z-0   relative "
        />
      </View>
      {/* Streak count on fire */}
      <MaskedView
        style={{ zIndex: 50, position: "absolute", left: "59%", top: -5 }}
        maskElement={
          <Text className="text-2xl font-PoppinsBold ">{streakCount}</Text>
        }
      >
        <LinearGradient
          colors={["#FB990F", "#EA0505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
        >
          {/* Invisible text only to preserve size */}
          <Text style={{ opacity: 0 }} className="text-2xl font-PoppinsBold  ">
            {streakCount}
          </Text>
        </LinearGradient>
      </MaskedView>

      <View>
        <View className="flex flex-row justify-center items-center absolute -right-2 -top-4">
          <Image source={require("../assets/images/sunProtection.png")} />
          <MaskedView
            maskElement={
              <Text className="text-3xl font-PoppinsBold ">
                {protectionCount}
              </Text>
            }
          >
            <LinearGradient
              colors={["#2DE2E2", "#0922A0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              {/* Invisible text only to preserve size */}
              <Text
                style={{ opacity: 0 }}
                className="text-3xl font-PoppinsBold  "
              >
                {protectionCount}
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
        {/* Streak Count */}
        <Text className="text-center font-PoppinsBold text-3xl my-8">
          {streakCount} Day Streak!
        </Text>

        <View className="flex flex-row justify-around items-center">
          {/* Monday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Monday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
          {/* Tuesday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Tuesday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
                Tu
              </Text>
            )}
          </View>
          {/* Wednesday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Wednesday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
                We
              </Text>
            )}
          </View>
          {/* Thursday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Thursday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
                Th
              </Text>
            )}
          </View>
          {/* Friday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Friday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
                Fr
              </Text>
            )}
          </View>
          {/* Saturday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Saturday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
                Sa
              </Text>
            )}
          </View>
          {/* Sunday */}
          <View>
            <View className="w-10 h-10 rounded-full border-2 border-[#FFC38B] relative">
              {today === "Sunday" ? (
                <Image
                  source={require("../assets/images/fire.png")}
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: -10,
                    top: -15,
                  }}
                />
              ) : null}
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
                  {/* Invisible text only to preserve size */}
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
