import React from "react";
import { View, Text } from "react-native";
import SectionItem from "./SectionItem";

interface Props {
  onEditData: () => void;
  onChangePassword: () => void;
}

export default function AccountSection({ onEditData, onChangePassword }: Props) {
  return (
    <View className="w-11/12 flex flex-col gap-3 mt-4">
      <Text className="font-PoppinsBold text-[#3C3C3C] text-xl md:text-2xl">
        Account
      </Text>

      <SectionItem
        icon={require("@/assets/images/user.png")}
        text="Edit personal data"
        onPress={onEditData}
      />
      <SectionItem
        icon={require("@/assets/images/lock.png")}
        text="Change password"
        onPress={onChangePassword}
      />
    </View>
  );
}
