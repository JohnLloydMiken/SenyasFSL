import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import UserStreak from "@/components/main_interface/userStreak";

import { useBottomSheet } from "@/modules/contextProvider";

export default function Profile() {
  const [editUserData, setEditUserData] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const { handleSheetRender, openSheet } = useBottomSheet();

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFBF1",
        }}
      >
        {/* Profile Info */}
        <View className="w-11/12">
          <Text className="text-[#1A6509] font-PoppinsBold text-2xl md:text-3xl">
            115XP
          </Text>
          <MaskedView
            maskElement={
              <Text className="text-3xl md:text-4xl font-PoppinsBold text-center">
                Username
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              <Text
                style={{ opacity: 0 }}
                className="text-3xl md:text-4xl font-PoppinsBold text-center"
              >
                Username
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text className="text-center my-2 font-PoppinsRegular text-xl md:text-2xl">
            Email
          </Text>
        </View>

        <View className="w-full  flex items-center justify-center mt-32 mb-4">
          <UserStreak streakCount={10} protectionCount={1} />
        </View>

        {/* Account Section */}
        <View className="w-11/12 flex flex-col gap-3 mt-4">
          <Text className="font-PoppinsBold text-[#3C3C3C] text-xl md:text-2xl">
            Account
          </Text>

          <TouchableOpacity
            onPress={() => {
              handleSheetRender("editData");
              openSheet(); //
            }}
            className="w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]"
          >
            <Image source={require("../../assets/images/user.png")} />
            <Text className="text-[#242424] text-lg md:text-xl font-PoppinsSemiBold">
              Edit personal data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditPassword(!editPassword)}
            className="w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]"
          >
            <Image source={require("../../assets/images/lock.png")} />
            <Text className="text-[#242424] text-lg md:text-xl font-PoppinsSemiBold">
              Change password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Learning progress Section */}

        <View className="w-11/12 my-8">
          <Text className="font-PoppinsBold text-[#3C3C3C] text-xl md:text-2xl mb-2">
            Learning progress
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleSheetRender("editData");
              openSheet(); //
            }}
            className="w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]"
          >
            <Image source={require("../../assets/images/reset.png")} />
            <Text className="text-[#242424] text-lg md:text-xl font-PoppinsSemiBold">
              Edit personal data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}

        <View className="w-11/12 mb-8">
          <Text className="font-PoppinsBold text-[#3C3C3C] md:text-2xl text-xl mb-2">
            Support
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleSheetRender("editData");
              openSheet(); //
            }}
            className="w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]"
          >
            <Image source={require("../../assets/images/help.png")} />
            <Text className="text-[#242424] text-lg md:text-xl font-PoppinsSemiBold">
              Edit personal data
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-11/12 flex flex-col gap-10 mb-8">
          <TouchableOpacity className="w-full p-4 border-4 border-[#FB990F] rounded-xl">
            <Text className="font-PoppinsBold text-[#FB990F] text-2xl md:text-3xl text-center">
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full ">
            <Text className="font-PoppinsBold text-[#6C6C6C] text-2xl md:text-3xl text-center">
              Delete account
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full bg-[#F4E6C1] p-4 flex flex-col ">
          <TouchableOpacity className="w-full p-2 border-b-2 border-b-[#CCB066]">
            <Text className="text-sm md:text-lg font-PoppinsRegular text-[#525252]">
              Imprint
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full p-2 border-b-2 border-b-[#CCB066]">
            <Text className="text-sm md:text-lg font-PoppinsRegular text-[#525252]">
              Terms and Conditions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full p-2 border-b-2 border-b-[#CCB066]">
            <Text className="text-sm md:text-lg font-PoppinsRegular text-[#525252]">
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <View className="relative bottom-0 mx-auto mt-10">
            <Text className="text-xs md:text-sm text-[#7A7A7A] text-center">
              Version 1
            </Text>
            <Text className="text-xs md:text-sm text-[#7A7A7A] text-center">
              @ SenyasFSL 2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFBF1",
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    backgroundColor: "#FAF3E0",
  },
});

/**
{editUserData && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={['60%']}
          detached
          enablePanDownToClose
 
        >
          <BottomSheetView style={styles.contentContainer}>
              <UserInput  
                title='Edit personal data'
                usernameTitle='Username'
                userEmailTitle='Email'
                userPasswordTitle='Current password'
                passwordTitleDescription='Type in your password to update your email'
              />
              <View className='w-11/12  absolute bottom-1'>
              <Authbutton content='Save changes' onPress={()=>    bottomSheetRef.current?.close()}></Authbutton>
               </View>
          </BottomSheetView>
        </BottomSheet>
      )} 

 */
