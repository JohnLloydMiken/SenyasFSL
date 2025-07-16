import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import React from "react";
import Authbutton from "@/components/button";
import whyFSL_choices from "@/json_files/whylearnFSL.json";
import { useState } from "react";
import { router } from "expo-router";
import Deaf from "@/assets/svgs/deaf.svg";
import Fun from "@/assets/svgs/Fun.svg";
import Family from "@/assets/svgs/Family.svg";
import Others from "@/assets/svgs/Others.svg";
import Work from "@/assets/svgs/Work.svg";
import Friends from "@/assets/svgs/Friends.svg";

const svgMap: { [key: string]: any } = {
  "Family.svg": Family,
  "Work.svg": Work,
  "Friends.svg": Friends,
  "deaf.svg": Deaf,
  "Others.svg": Others,
  "Fun.svg": Fun,
};

export default function register_whyFSL() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const { width } = useWindowDimensions();

  const svgSize = width < 768 ? 30 : 50;

  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-4">
      <Text className="text-2xl md:text-3xl font-PoppinsBold mt-4">
        Why would you like to learn FSL?
      </Text>
      <View className="w-11/12 h-max ">
        <FlatList
          data={whyFSL_choices}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const SvgIcon = svgMap[item.image];
            return (
              <TouchableOpacity
                className={`w-full flex justify-start items-center gap-4 border-[1px] border-[#F7D674] ${selectedItemIndex === index ? "bg-[#FFEEB9]" : "bg-white"} flex-row rounded-3xl px-4 py-2 my-4`}
                onPress={() =>
                  setSelectedItemIndex(
                    selectedItemIndex === index ? null : index
                  )
                }
              >
                {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
                <Text className="text-lg md:text-2xl font-PoppinsSemiBold mt-2 text-[#8B8B8B]">
                  {item.reason}
                </Text>
              </TouchableOpacity>
            );
          }}
          style={{ width: "100%" }}
        />
      </View>
      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Next"
          onPress={() => router.push("/register_how")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
