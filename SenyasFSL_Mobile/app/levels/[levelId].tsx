import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import ViewMC from "@/components/Game_Modes/VideoMC";

export default function LevelContent() {
  const { levelId } = useLocalSearchParams();
  return (
    <View className="flex-1  relative bg-white">
      <ViewMC />
    </View>
  );
}

const styles = StyleSheet.create({});
