import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import TrueOrFalse from "@/components/Game_Modes/TrueOrFalse";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  return (
    <View className="flex-1  relative bg-white">
      <TrueOrFalse />
    </View>
  );
}

const styles = StyleSheet.create({});
