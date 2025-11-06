import AccountSection from "@/components/main_interface/profile/AccountSection";
import FooterLinks from "@/components/main_interface/profile/FooterLinks";
import LearningSection from "@/components/main_interface/profile/LearningSection";
import SupportSection from "@/components/main_interface/profile/SupportSection";
import User_info from "@/components/main_interface/profile/user_info";
import UserStreak from "@/components/main_interface/userStreak";
import { useBottomSheet } from "@/modules/contextProvider";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { useRouter } from "expo-router"; // Import the router
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
// Import logoutUser and the new sendPasswordResetIfExists
import { logoutUser, sendPasswordResetIfExists } from "@/services/AuthService";

export default function Profile() {
  // This state is no longer used for the password button, but could be used for the editPass sheet
  const [editPassword, setEditPassword] = useState(false);
  const { handleSheetRender, openSheet } = useBottomSheet();
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading, clearUserData } = useUserStore();
  const router = useRouter(); // Initialize the router

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the auth service function

      // Manually clear the separate user profile data store
      if (clearUserData) {
        clearUserData();
      }

      // --- START: Add navigation ---
      // Redirect to the auth index screen.
      // We use 'replace' so the user can't go "back" to the profile.
      router.replace("./(auth)/");
      // --- END: Add navigation ---
    } catch (error: any) {
      Alert.alert(
        "Logout Failed",
        error.message || "Could not log out. Please try again."
      );
    }
  };

  // --- START: Add password reset handler ---
  const handlePasswordReset = async () => {
    if (!userData?.email) {
      Alert.alert("Error", "Could not find your email address.");
      return;
    }
    try {
      const message = await sendPasswordResetIfExists(userData.email);
      Alert.alert("Password Reset", message);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not send reset email.");
    }
  };
  // --- END: Add password reset handler ---

  if (authLoading || userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 3. Add a check in case the user isn't logged in
  if (!user || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Could not load user profile.</Text>
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#FFFBF1",
      }}
    >
      {/* Profile Info */}
      <User_info
        username={userData.username}
        xp={userData.xp}
        email={userData.email}
      />

      {/* User Streak */}
      <View className="w-full flex items-center justify-center mt-32 mb-4">
        <UserStreak currentStreak={userData.currentStreak} streakFreezes={userData.streakFreezes} activityDays={userData.activityDays} />
      </View>

      {/* Account Section */}
      <AccountSection
        onEditData={() => {
          handleSheetRender("editData");
          openSheet();
        }}
        // --- START: Updated onChangePassword prop ---
        onChangePassword={handlePasswordReset}
        // --- END: Updated onChangePassword prop ---
        // Note: To open the "editPass" sheet, you would use:
        // onChangePassword={() => {
        //   handleSheetRender("editPass");
        //   openSheet();
        // }}
      />

      {/* Learning Progress Section */}
      <LearningSection
        onPressEdit={() => {
          handleSheetRender("editData");
          openSheet();
        }}
      />

      {/* Support Section */}
      <SupportSection
        onPressHelp={() => {
          handleSheetRender("editData");
          openSheet();
        }}
      />

      {/* Logout / Delete */}
      <View className="w-11/12 flex flex-col gap-10 mb-8">
        <TouchableOpacity
          className="w-full p-4 border-4 border-[#FB990F] rounded-xl"
          onPress={handleLogout} // Attach the handler here
        >
          <Text className="font-PoppinsBold text-[#FB990F] text-2xl md:text-3xl text-center">
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full">
          <Text className="font-PoppinsBold text-[#6C6C6C] text-2xl md:text-3xl text-center">
            Delete account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <FooterLinks />
    </ScrollView>
  );
}