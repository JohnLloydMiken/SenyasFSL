import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import FillTheGap from "@/components/Game_Modes/FillTheGap";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  return (
    <View className="flex-1  relative bg-white">
      <FillTheGap />
    </View>
  );
}

const styles = StyleSheet.create({});
