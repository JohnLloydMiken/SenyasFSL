// app/(main_interface)/profile.tsx
// --- MODIFIED FILE ---

import AccountSection from "@/components/main_interface/profile/AccountSection";
import FooterLinks from "@/components/main_interface/profile/FooterLinks";
import LearningSection from "@/components/main_interface/profile/LearningSection";
import SupportSection from "@/components/main_interface/profile/SupportSection";
import User_info from "@/components/main_interface/profile/user_info";
import UserStreak from "@/components/main_interface/userStreak";
import { useBottomSheet } from "@/modules/contextProvider";
import { useAuthStore } from "@/utils/store/useAuthStore";
// 🚫 import { useUserStore } from "@/utils/store/useUserStore"; // No longer needed
import { useRouter } from "expo-router"; // Import the router
import React, { useState } from "react"; // --- Import useState ---
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import logoutUser and the new sendPasswordResetIfExists
import {
  logoutUser,
  sendPasswordResetIfExists,
  reauthenticateUser,
  deleteUserAccount,
} from "@/services/AuthService";
import ResetProgressModal from "@/components/main_interface/profile/ResetProgressModal";
import TermsModal from "@/components/main_interface/profile/TermsModal";
import PrivacyModal from "@/components/main_interface/profile/PrivacyModal";
import DeleteAccountModal from "@/components/main_interface/profile/DeleteAccountModal";
// ✅ 1. Import TanStack Query and the fetcher
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";

export default function Profile() {
  const { handleSheetRender, openSheet } = useBottomSheet();
  const { user, loading: authLoading } = useAuthStore();
  // 🚫 const { userData, loading: userLoading, clearUserData } = useUserStore(); // No longer needed
  const router = useRouter(); // Initialize the router
  const queryClient = useQueryClient(); // ✅ 2. Get the query client
  const userId = useAuthStore((state) => state.user?.uid);
  // --- START: Add state for new modals ---
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // --- END: Add state for new modals ---

  // ✅ 3. Fetch user data using useQuery
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.uid], // The same key used in other files
    queryFn: () => fetchUserProfile(user!.uid),
    enabled: !!user,
  });

  const handleConfirmDelete = async (password: string): Promise<void> => {
    try {
      // 1. Re-authenticate the user
      await reauthenticateUser(password);

      // 2. Call the delete function
      await deleteUserAccount();

      // 3. If deletion succeeds, close modal, clear query cache, and redirect
      // 🚫 clearUser() removed - deleteUserAccount handles it
      setDeleteModalVisible(false);
      queryClient.clear(); // Clear the query cache
      router.replace("/"); // Redirect to login/home
    } catch (error) {
      // Re-throw the error so the modal's catch block can display it
      console.error("Error deleting account:", error);
      throw error;
    }
  };
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the auth service function
      // 🚫 if (clearUserData) { clearUserData(); } // No longer needed
      queryClient.clear(); // ✅ 4. Clear the TanStack Query cache on logout
      router.replace("./(auth)/");
    } catch (error: any) {
      Alert.alert(
        "Logout Failed",
        error.message || "Could not log out. Please try again."
      );
    }
  };

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

  // ✅ 5. Updated loading check
  if (authLoading || userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ 6. This check is still valid
  if (!user || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Could not load user profile.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
          <UserStreak
            currentStreak={userData.currentStreak}
            streakFreezes={userData.streakFreezes}
            activityDays={userData.activityDays}
          />
        </View>

        {/* Account Section */}
        <AccountSection
          onEditData={() => {
            handleSheetRender("editData");
            openSheet();
          }}
          onChangePassword={() => {
            handleSheetRender("editPass");
            openSheet();
          }}
        />

        {/* Learning Progress Section */}
        <LearningSection
          onResetProgress={() => setResetModalVisible(true)} // Add this prop
        />

        {/* Support Section */}
        <SupportSection
          onPressHelp={() => {
            handleSheetRender("help");
            openSheet();
          }}
        />

        {/* Logout / Delete */}
        <View className="w-11/12 flex flex-col gap-10 mb-8">
          <TouchableOpacity
            className="w-full p-4 border-4 border-[#FB990F] rounded-xl"
            onPress={handleLogout}
          >
            <Text className="font-PoppinsBold text-[#FB990F] text-2xl md:text-3xl text-center">
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full"
            onPress={() => setDeleteModalVisible(true)}
          >
            <Text className="font-PoppinsBold text-[#6C6C6C] text-2xl md:text-3xl text-center">
              Delete account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <FooterLinks
          onPressAbout={() => {
            handleSheetRender("about");
            openSheet();
          }}
          onPressTerms={() => {
            setTermsModalVisible(true);
          }}
          onPressPrivacy={() => {
            setPrivacyModalVisible(true);
          }}
        />
      </ScrollView>

      {/* --- Render the new Modals --- */}
      <TermsModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
      <PrivacyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />
      <ResetProgressModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
      />
      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
