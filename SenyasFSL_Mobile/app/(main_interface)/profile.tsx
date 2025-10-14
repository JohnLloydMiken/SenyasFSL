import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import UserStreak from "@/components/main_interface/userStreak";
import User_info from "@/components/main_interface/profile/user_info";
import { useBottomSheet } from "@/modules/contextProvider";
import AccountSection from "@/components/main_interface/profile/AccountSection";
import LearningSection from "@/components/main_interface/profile/LearningSection";
import SupportSection from "@/components/main_interface/profile/SupportSection";
import FooterLinks from "@/components/main_interface/profile/FooterLinks";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
export default function Profile() {
  const [editPassword, setEditPassword] = useState(false);
  const { handleSheetRender, openSheet } = useBottomSheet();
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();

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
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#FFFBF1",
      }}
    >
      {/* Profile Info */}
      <User_info username={userData.username} xp={userData.xp} email={userData.email} />

      {/* User Streak */}
      <View className="w-full flex items-center justify-center mt-32 mb-4">
        <UserStreak streakCount={userData.currentStreak} protectionCount={1} />
      </View>

      {/* Account Section */}
      <AccountSection
        onEditData={() => {
          handleSheetRender("editData");
          openSheet();
        }}
        onChangePassword={() => setEditPassword(!editPassword)}
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
        <TouchableOpacity className="w-full p-4 border-4 border-[#FB990F] rounded-xl">
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
