import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import BackToLevelsBtn from "@/components/BackToLevelsBtn";
import { router } from "expo-router";
import { useState } from "react";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetProvider, useBottomSheet } from '@/modules/contextProvider';
export default function _layout() {
  const [isPressed, setIsPressed] = useState(false);
    const { handleSheetRender, openSheet } = useBottomSheet();
  return (
    <>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <BackToLevelsBtn onPress={() => {
              handleSheetRender("backToMain");
              openSheet();
            }} />
          ),
        }}
      />

      {isPressed &&  <View className="absolute w-full h-full left-0 top-0 bottom-0 right-0 bg-black/60 z-30"></View>}
      
    </>
  );
}

const styles = StyleSheet.create({});
