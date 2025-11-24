// app/(main_interface)/_layout.tsx
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
import { updateUserProfile } from "@/services/AuthService";
import ChangePasswordSheet from "@/components/main_interface/profile/ChangePasswordSheet";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchUserProfile } from "@/services/userService";
import { UserProfileData } from "@/shared/types/user";

const CACHED_USER_PROFILE_KEY = '@cached_user_profile';

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
  const router = useRouter();
  const { bottomSheetRef, handleSheetChanges, isSheetOpen, sheet } =
    useBottomSheet();
  const { width } = useWindowDimensions();
  const titleSize = width < 768 ? 12 : 18;

  const queryClient = useQueryClient();

  // State to track if we're offline and using cached data
  const [isOffline, setIsOffline] = useState(false);
  const [cachedUserData, setCachedUserData] = useState<UserProfileData | null>(null);

  // Try to fetch user profile from Firebase
  const { data: userData, isLoading: userLoading, error } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async () => {
      try {
        const profile = await fetchUserProfile(user!.uid);
        
        // If successful, cache the data
        if (profile) {
          await AsyncStorage.setItem(CACHED_USER_PROFILE_KEY, JSON.stringify(profile));
          setIsOffline(false);
        }
        
        return profile;
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        throw err;
      }
    },
    enabled: !!user,
    retry: 1, // Only retry once
    retryDelay: 1000,
  });

  // Load cached data on mount
  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHED_USER_PROFILE_KEY);
        if (cached) {
          setCachedUserData(JSON.parse(cached));
          console.log("Loaded cached user profile for offline use");
        }
      } catch (err) {
        console.error("Failed to load cached profile:", err);
      }
    })();
  }, []);

  // Detect offline mode
  useEffect(() => {
    if (error && cachedUserData) {
      console.log("Using cached profile data (offline mode)");
      setIsOffline(true);
    }
  }, [error, cachedUserData]);

  const snapPoints = useMemo(() => {
    switch (sheet) {
      case "streak":
        return ["50%"];
      case "editData":
      case "editPass":
        return ["70%"];
      default:
        return ["1"];
    }
  }, [sheet]);

  // Use cached data if offline, otherwise use fresh data
  const activeUserData = isOffline ? cachedUserData : userData;

  const [username, setUsername] = useState(activeUserData?.username || "");
  const [email, setEmail] = useState(activeUserData?.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSheetOpen && sheet === "editData") {
      setUsername(activeUserData?.username || "");
      setEmail(activeUserData?.email || "");
      setPassword("");
    }
  }, [isSheetOpen, sheet, activeUserData]);

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

      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message || "An unknown error occurred."
      );
    }
  };

  // Show loading only if we don't have cached data
  if (authLoading || (userLoading && !cachedUserData)) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text className="text-3xl font-PoppinsBold text-orange-500">Preparing the Game ...</Text>
      </View>
    );
  }

  // Only show error if we have no cached data to fall back on
  if (!activeUserData) {
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
          headerLeft: () => (
            <View className="flex-row items-center">
              <Curency number={activeUserData?.senyasCoins} />
              {isOffline && (
                <Text className="text-xs text-gray-500 ml-2">(Offline)</Text>
              )}
            </View>
          ),
          headerRight: () => (
            <HeaderRightBtn
              achievementCount={activeUserData.achievements.length}
              streakCount={activeUserData.currentStreak}
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
          listeners={{
            tabPress: (e) => {
              if (isOffline) {
                e.preventDefault();
                Alert.alert(
                  "No Internet Connection",
                  "Please connect to the internet to access the Home tab."
                );
              }
            },
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
          listeners={{
            tabPress: (e) => {
              if (isOffline) {
                e.preventDefault();
                Alert.alert(
                  "No Internet Connection",
                  "Please connect to the internet to access the Treasure tab."
                );
              }
            },
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
          // Dictionary is always accessible (no listener blocking it)
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
          listeners={{
            tabPress: (e) => {
              if (isOffline) {
                e.preventDefault();
                Alert.alert(
                  "No Internet Connection",
                  "Please connect to the internet to access your Profile."
                );
              }
            },
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
                  streakFreezes={activeUserData.streakFreezes}
                  currentStreak={activeUserData.currentStreak}
                  activityDays={activeUserData.activityDays}
                />

                <TouchableOpacity
                  className="w-11/12 p-4 bg-[#FB990F] rounded-xl absolute bottom-10"
                  onPress={() => shareStreak(activeUserData.currentStreak)}
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
    position: "relative",
    width: "100%",
    height: "100%",
  },
});