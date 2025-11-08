// components/main_interface/profile/PasswordPolicyCheck.tsx
import React from "react";
import { View, Text } from "react-native";
import { usePasswordPolicy, POLICY_LIST } from "@/hooks/usePasswordPolicy";
import { Ionicons } from "@expo/vector-icons"; // Assuming you use expo-icons

type Props = {
  password?: string;
};

const PasswordPolicyCheck: React.FC<Props> = ({ password = "" }) => {
  const { policyStatus } = usePasswordPolicy(password);

  // Don't show the policy check until the user starts typing
  if (password.length === 0) {
    return null;
  }

  return (
    <View className="mt-3 space-y-1.5">
      {POLICY_LIST.map(({ key, label }) => {
        const isMet = policyStatus[key as keyof typeof policyStatus];
        return (
          <View key={key} className="flex-row items-center space-x-2">
            <Ionicons
              name={isMet ? "checkmark-circle" : "close-circle-outline"}
              size={18}
              color={isMet ? "#22C55E" : "#EF4444"} // green-500 : red-500
            />
            <Text
              className={`text-sm ${
                isMet ? "text-green-600" : "text-red-600"
              }`}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default PasswordPolicyCheck;