import React, { useMemo, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs, useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { shareStreak } from "@/utils/shareUtils"; // (adjust path if needed)
import Curency from "@/components/main_interface/curency";
import HeaderRightBtn from "@/components/authentication/headerRightBtn";
import HomeIcon from "@/components/main_interface/homeIcon";
import ProfileIcon from "@/components/main_interface/profileIcon";
import DictionaryIcon from "@/components/main_interface/dictionaryIcon";
import TreasureIcon from "@/components/main_interface/treasure/treasureIcon";
import UserStreak from "@/components/main_interface/userStreak";
import UserInput from "@/components/authentication/userInput";
import Authbutton from "@/components/authentication/button";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { BottomSheetProvider, useBottomSheet } from "@/modules/contextProvider";
import { updateUserProfile } from "@/services/authService";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetProvider>
        <TabsWithBottomSheet />
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
}

function TabsWithBottomSheet() {
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();
  const { bottomSheetRef, handleSheetChanges, isSheetOpen, sheet } =
    useBottomSheet();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const titleSize = width < 768 ? 12 : 18;
  const snapPoints = useMemo(() => {
    switch (sheet) {
      case "streak":
        return ["50%"];
      case "editData":
      case "editPass":
        return ["60%"];
      default:
        return ["1"];
    }
  }, [sheet]);

  const [username, setUsername] = useState(userData?.username || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSheetOpen && sheet === "editData") {
      setUsername(userData?.username || "");
      setEmail(userData?.email || "");
      setPassword("");
    }
  }, [isSheetOpen, sheet, userData]);



  const handleUpdateProfile = async () => {
    if (!password) {
      Alert.alert(
        "Password Required",
        "Please enter your current password to save changes."
      );
      return;
    }
    try {
      await updateUserProfile({
        newUsername: username,
        newEmail: email,
      });

      Alert.alert("Success", "Profile updated successfully!");
      bottomSheetRef.current?.close();
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message || "An unknown error occurred."
      );
    }
  };

  if (userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Could not load user profile. Please try again later.</Text>
      </View>
    );
  }
  return (
    <>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerTitle: "",
          tabBarStyle: isSheetOpen ? { display: "none" } : {},
          headerLeft: () => <Curency number={userData?.senyasCoins} />,
          headerRight: () => (
            <HeaderRightBtn
              achievementCount={0}
              streakCount={userData.currentStreak}
              onPressAchievement={() => router.push("./headeroptions/")}
              onPressLeaderboards={() =>
                router.push("../headeroptions/leaderboards")
              }
            />
          ),
          headerStyle: {
            borderBottomWidth: 0.5,
            borderBottomColor: "black",
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
          tabBarActiveTintColor: "#EA0505",
          tabBarInactiveTintColor: "#8B8B8B",
        }}
      >
        {/* ...Tabs.Screen definitions... */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
            title: "Home",
            tabBarLabelStyle: {
              fontSize: titleSize,
            },
            tabBarLabelPosition: "below-icon",
          }}
        />
        <Tabs.Screen
          name="treasure"
          options={{
            lazy: false,
            tabBarIcon: ({ focused }) => <TreasureIcon focused={focused} />,
            title: "Treasure",
            tabBarLabelStyle: {
              fontSize: titleSize,
            },
            tabBarLabelPosition: "below-icon",
          }}
        />
        <Tabs.Screen
          name="dictionary"
          options={{
            lazy: false,
            tabBarIcon: ({ focused }) => <DictionaryIcon focused={focused} />,
            title: "Dictionary",
            tabBarLabelStyle: {
              fontSize: titleSize,
            },
            tabBarLabelPosition: "below-icon",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            lazy: false,
            tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
            title: "Profile",
            tabBarLabelStyle: {
              fontSize: titleSize,
            },
            tabBarLabelPosition: "below-icon",
          }}
        />
      </Tabs>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={sheet === null ? -1 : 0}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.container}>
        {sheet === "streak" && (
            <>
              <View className="w-full relative flex-col justify-center items-center h-full">
                <UserStreak 
                  streakFreezes={userData.streakFreezes} 
                  currentStreak={userData.currentStreak} 
                  activityDays={userData.activityDays} 
                />

                {/* --- 3. UPDATE THE BUTTON'S onPress --- */}
                <TouchableOpacity 
                  className="w-11/12 p-4 bg-[#FB990F] rounded-xl absolute bottom-10"
                  // Call the imported function directly
                  onPress={() => shareStreak(userData.currentStreak)}
                >
                  <Text className="font-PoppinsBold text-2xl text-center text-white">
                    Share your Streak
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {sheet === "editData" && (
            <>
              <View className="flex-1 flex-col justify-center items-center">
                {/* --- START: Updated props for UserInput --- */}
                <UserInput
                  title="Edit personal data"
                  usernameTitle="Username"
                  userEmailTitle="Email"
                  userPasswordTitle="Current password"
                  passwordTitleDescription="Type in your password to update your email"
                  // Pass the state and setters to the correct props
                  usernameValue={username}
                  onUsernameChange={setUsername}
                  emailValue={email}
                  onEmailChange={setEmail}
                  passwordValue={password}
                  onPasswordChange={setPassword}
                />
                {/* --- END: Updated props for UserInput --- */}
                <View className="w-11/12 absolute bottom-1">
                  <Authbutton
                    content="Save changes"
                    onPress={handleUpdateProfile}
                  />
                </View>
              </View>
            </>
          )}

          {sheet === "editPass" && (
            <>
              {/* You would apply a similar state/handler logic here for changeUserPassword */}
              <UserInput
                title="Edit personal data"
                usernameTitle="Username"
                userEmailTitle="Email"
                userPasswordTitle="Current password"
                passwordTitleDescription="Type in your password to update your email"
              />
              <View className="w-11/12 absolute bottom-1">
                <Authbutton
                  content="Update password"
                  onPress={() => bottomSheetRef.current?.close()}
                />
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    width: "100%",
    height: "100%",
  },
});
