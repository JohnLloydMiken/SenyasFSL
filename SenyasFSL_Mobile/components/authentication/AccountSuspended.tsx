import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AccountSuspendedProps {
  email: string;
}

export default function AccountSuspended({ email }: AccountSuspendedProps) {
  const supportEmail = "s3nyasfsl@gmail.com";

  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-center px-6">
      {/* Icon */}
      <View className="items-center mb-8">
        <View className="relative">
          <MaterialIcons name="person" size={80} color="#FF6B6B" />
          <View className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
            <MaterialIcons name="block" size={40} color="#FF6B6B" />
          </View>
        </View>
      </View>

      {/* Title */}
      <Text className="text-3xl font-PoppinsBold text-center mb-4">
        Account Suspended
      </Text>

      {/* Message */}
      <View className="bg-white rounded-2xl p-6 mb-8 w-full">
        <Text className="text-base font-PoppinsRegular text-center text-gray-700">
          This account associated with{" "}
          <Text className="font-PoppinsBold">{email}</Text> has been suspended
          by an administrator.
        </Text>

        <View className="h-px bg-gray-300 my-4" />

        <Text className="text-sm font-PoppinsRegular text-center text-gray-600">
          If you believe this is an error, please contact our support team at{" "}
          <Text className="font-PoppinsBold text-[#FB990F]">
            {supportEmail}
          </Text>
          .
        </Text>
      </View>

      {/* Back to Login Button */}
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/login")}
        className="w-full bg-[#FB990F] rounded-2xl p-4"
      >
        <Text className="font-PoppinsBold text-center text-xl text-white">
          Go back to Login Page
        </Text>
      </TouchableOpacity>
    </View>
  );
}