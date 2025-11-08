// components/main_interface/profile/ChangePasswordSheet.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePasswordPolicy } from "@/hooks/usePasswordPolicy";
import PasswordPolicyCheck from "./PasswordPolicyCheck";
import Authbutton from "@/components/authentication/button";
import { reauthenticateUser, changeUserPassword } from "@/services/AuthService"; // Ensure these are exported from your AuthService

type Props = {
  onClose: () => void;
};

const ChangePasswordSheet: React.FC<Props> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const { isPolicyMet } = usePasswordPolicy(newPassword);
  const newPasswordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async () => {
    setLocalError("");

    if (!currentPassword.trim()) {
      setLocalError("Please enter your current password.");
      return;
    }
    if (!isPolicyMet) {
      setLocalError("The new password does not meet requirements.");
      return;
    }
    if (!newPasswordsMatch) {
      setLocalError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Re-authenticate
      await reauthenticateUser(currentPassword);
      
      // Step 2: Change password
      await changeUserPassword(newPassword);
      
      Alert.alert("Success", "Password changed successfully!");
      onClose();

    } catch (err: any) {
      // Map common errors
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setLocalError("Incorrect current password. Please try again.");
      } else {
        setLocalError(err.message || "An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    isLoading ||
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmPassword.trim() ||
    !isPolicyMet ||
    !newPasswordsMatch;

  return (
    <ScrollView style={{flex:1, padding:16}} showsVerticalScrollIndicator={false}>
      <Text className="text-center text-2xl font-PoppinsBold mb-6 mt-3">
        Change your password
      </Text>

      {localError && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-700 text-center font-PoppinsMedium">
            {localError}
          </Text>
        </View>
      )}

      {/* Current Password */}
      <View className="flex flex-col mb-5">
        <Text className="font-PoppinsBold text-base">Current password</Text>
        <Text className="text-sm text-gray-700 mb-2 font-PoppinsMedium">
          Type in your password to confirm changes
        </Text>
        <View className="relative">
          <TextInput
            secureTextEntry={!showCurrent}
            placeholder="••••••••"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            className="w-full px-4 py-3 border border-[#D5DDE5] rounded-lg bg-white"
          />
          <TouchableOpacity
            onPress={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-3.5"
          >
            <Ionicons
              name={showCurrent ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Password */}
      <View className="flex flex-col mb-5">
        <Text className="font-PoppinsBold text-base">New password</Text>
        <View className="relative">
          <TextInput
            secureTextEntry={!showNew}
            placeholder="••••••••"
            value={newPassword}
            onChangeText={setNewPassword}
            className="w-full px-4 py-3 border border-[#D5DDE5] rounded-lg bg-white"
          />
          <TouchableOpacity
            onPress={() => setShowNew((v) => !v)}
            className="absolute right-3 top-3.5"
          >
            <Ionicons
              name={showNew ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <PasswordPolicyCheck password={newPassword} />
      </View>

      {/* Confirm New Password */}
      <View className="flex flex-col mb-6">
        <Text className="font-PoppinsBold text-base">Confirm new password</Text>
        <View className="relative">
          <TextInput
            secureTextEntry={!showConfirm}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="w-full px-4 py-3 border border-[#D5DDE5] rounded-lg bg-white"
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-3.5"
          >
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {!newPasswordsMatch && confirmPassword.length > 0 && (
          <Text className="text-xs text-red-600 mt-1 flex items-center">
            Passwords do not match.
          </Text>
        )}
      </View>

      <Authbutton
        content={isLoading ? "Loading..." : "Change password"}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

export default ChangePasswordSheet;