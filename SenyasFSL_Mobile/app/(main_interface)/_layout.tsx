// app/(main_interface)/_layout.tsx
// --- MODIFIED FILE ---

import Authbutton from "@/components/authentication/button";
import HeaderRightBtn from "@/components/authentication/headerRightBtn";
import UserInput from "@/components/authentication/userInput";
import Curency from "@/components/main_interface/curency";
import DictionaryIcon from "@/components/main_interface/dictionaryIcon";
import HomeIcon from "@/components/main_interface/homeIcon";
import ProfileIcon from "@/components/main_interface/profileIcon";
import TreasureIcon from "@/components/main_interface/treasure/treasureIcon";
import UserStreak from "@/components/main_interface/userStreak";
import { shareStreak } from "@/utils/shareUtils";
import { useAuthStore } from "@/utils/store/useAuthStore";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import AboutModal from "@/components/main_interface/profile/AboutModal";
import HelpModal from "@/components/main_interface/profile/HelpModal";
import EditPersonalData from "@/components/main_interface/profile/EditPersonalData";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetProvider, useBottomSheet } from "@/modules/contextProvider";
import { updateUserProfile } from "@/services/AuthService"; //
import ChangePasswordSheet from "@/components/main_interface/profile/ChangePasswordSheet";

// ✅ 1. Import *only* the hooks, not the Client/Provider
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// ✅ 2. Import your user profile fetcher
import { fetchUserProfile } from "@/services/userService"; //

// 🚫 3. DELETE THE REDUNDANT CLIENT
// const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 🚫 4. DELETE THE REDUNDANT PROVIDER
    // <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetProvider>
        <TabsWithBottomSheet />
      </BottomSheetProvider>
    </GestureHandlerRootView>
    // </QueryClientProvider>
  );
}

function TabsWithBottomSheet() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const { bottomSheetRef, handleSheetChanges, isSheetOpen, sheet } =
    useBottomSheet();
  const { width } = useWindowDimensions();
  const titleSize = width < 768 ? 12 : 18;

  // ✅ 5. This hook now finds the *root* client (from app/_layout.tsx)
  const queryClient = useQueryClient();

  // ✅ 6. This query now uses the *root* client
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: () => fetchUserProfile(user!.uid), //
    enabled: !!user,
  });

  const snapPoints = useMemo(() => {
    switch (sheet) {
      case "streak":
        return ["50%"];
      case "editData":
        return ["50%"];
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
      }); //

      Alert.alert("Success", "Profile updated successfully!");
      bottomSheetRef.current?.close();

      // ✅ 7. This invalidates the *root* cache
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message || "An unknown error occurred."
      );
    }
  };

  // ✅ 8. This loading check now works perfectly.
  // It will show 'Loading...' if auth is loading,
  // OR if the root cache is being fetched for the first time.
  // It will *not* show 'Loading...' if the cache was
  // already filled by welcome.tsx.
  if (authLoading || userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading User Progress...</Text>
      </View>
    );
  }

  // ✅ 9. This check is still valid.
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
          // ✅ 10. This now reads from the *root* cache and will
          // update instantly when 'treasure.tsx' invalidates.
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
            tabBarIcon: ({ focused }) => <TreasureIcon focused={focused} />, //
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

                <TouchableOpacity
                  className="w-11/12 p-4 bg-[#FB990F] rounded-xl absolute bottom-10"
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
              <EditPersonalData />
            </>
          )}

          {sheet === "editPass" && (
            <>
              <ChangePasswordSheet
                onClose={() => bottomSheetRef.current?.close()}
              />
            </>
          )}

          {/* --- START: Added new modal views --- */}
          {sheet === "help" && (
            <HelpModal onPress={() => bottomSheetRef.current?.close()} />
          )}

          {sheet === "about" && (
            <AboutModal onPress={() => bottomSheetRef.current?.close()} />
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    position: "relative",
    width: "100%",
    height: "100%",
  },
});