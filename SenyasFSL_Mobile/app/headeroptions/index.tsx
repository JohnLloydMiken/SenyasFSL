import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Facts from "@/json_files/facts.json";
import Awards from "@/json_files/awards.json";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import Awards_lock from "@/assets/svgs/awards_lock.svg";
import Fact_locked from "@/assets/svgs/fact_lock.svg";
import PFD from "@/assets/svgs/PFD.svg";

export default function index() {
  const svgMap: { [key: string]: any } = {
    "awards_lock.svg": Awards_lock,
    "fact_lock.svg": Fact_locked,
  };
  const { width } = useWindowDimensions();

  const svgSize = width < 768 ? 100 : 120;

  const unlockedFacts = Facts.filter((f) => f.unlocked).length;

  return (
    <ScrollView>
      <View>
        <View className="ml-4 mt-4">
          <MaskedView
            maskElement={
              <Text className="text-2xl md:text-3xl font-PoppinsBold">Awards {`(0)`}</Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Invisible text only to preserve size */}
              <Text
                style={{ opacity: 0 }}
                className="text-2xl md:text-3xl font-PoppinsBold"
              >
                Awards {`(0)`}
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
        <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
          {Awards.map((item, index) => {
            const SvgIcon = svgMap[item.AwardImage];
            return (
              <TouchableOpacity
                key={index}
                className="w-1/3 mb-4  flex flex-col items-center"
              >
                {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
                <Text>{item.award_title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View>
        <View className="ml-4 mt-4">
          <MaskedView
            maskElement={
              <Text className="text-2xl md:text-3xl font-PoppinsBold">
                Facts {`(${unlockedFacts})`}
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Invisible text only to preserve size */}
              <Text
                style={{ opacity: 0 }}
                className="text-2xl md:text-3xl font-PoppinsBold"
              >
                Facts {`(0)`}
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
        <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
          {Facts.map((item, index) => {
            const SvgIcon = svgMap[item.image];
            return (
              <TouchableOpacity
                key={index}
                className="w-1/3 mb-4  flex flex-col items-center"
              >
                {item.unlocked ? (
                  <PFD width={svgSize} height={svgSize} />
                ) : (
                  <SvgIcon width={svgSize} height={svgSize} />
                )}
                <Text>{item.Fact_title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
