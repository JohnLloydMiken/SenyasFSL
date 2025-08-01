import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { Stack } from "expo-router";
import BackToLevelsBtn from "@/components/BackToLevelsBtn";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Authbutton from "@/components/button";
import Wait from '@/assets/svgs/Wait.svg'
import Slow from '@/assets/svgs/Slow.svg'
export default function _layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomView />
    </GestureHandlerRootView>
  );
}

const BottomView = () => {
  const [isPressed, setIsPressed] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 220 : 300;
  return (
    <>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <BackToLevelsBtn
              onPress={() => {
                setIsPressed(!isPressed);
                bottomSheetRef.current?.expand()
              }}
            />
      
          ),
          headerRight: () => <TouchableOpacity>
            <Slow/>
          </TouchableOpacity>,
          headerTitle: () => <View className="w-11/12 h-6 rounded-full bg-[#FFEEB9] mx-auto"/>,
          headerShadowVisible: true
        }}
      />

   

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[ "60%"]}
        index={-1}
       
      >
        <BottomSheetView style={styles.contentContainer}>
          {isPressed && (
            <View className="flex-1 w-full h-full justify-center items-center p-4">
              <View>
                <Wait width={svgSize} height={svgSize}/>
              </View>
              <View>
                <Text className="text-center text-xl md:text-2xl font-PoppinsBold">Wait, don’t go!</Text>
                <Text className="font-NunitoBold text-sm text-center md:text-lg">
                  You’re doing well! If you quit now, you’ll lose your progress
                  for this lesson.
                </Text>

               
              </View>
               <View className="w-full">
                  <Authbutton onPress={()=> {
                    setIsPressed(!isPressed)
                    bottomSheetRef.current?.close()
                  } } content="Keep Learning"/>
                     <TouchableOpacity
                            onPress={() => {
                              router.push('/main_interface')
                              
                            }}
                            className="w-full md:p-6 p-4 bg-[#FAF3E0] rounded-md border-[4px]  border-[#FB990F] "
                          >
                            <Text className="text-2xl md:text-3xl text-center text-[#FB990F] font-PoppinsBold">
                              I have already an account
                            </Text>
                          </TouchableOpacity>
                </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 50,
  },
  contentContainer: {
    flex: 1,

    zIndex: 50,
  },
});
