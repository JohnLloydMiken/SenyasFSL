import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface UserInputProps {
  title: string;
  usernameTitle: string;
  userEmailTitle: string;
  userPasswordTitle: string;
  passwordTitleDescription: string;
  usernameValue?: string;
  emailValue?: string;
  passwordValue?: string;
  onUsernameChange?: (text: string) => void;
  onEmailChange?: (text: string) => void;
  onPasswordChange?: (text: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({
  title,
  usernameTitle,
  userEmailTitle,
  userPasswordTitle,
  passwordTitleDescription,
  usernameValue,
  emailValue,
  passwordValue,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 20 : 30;

  return (
    <>
      <View className="w-11/12">
        <Text className="text-2xl font-PoppinsBold text-center md:text-3xl">
          {title}
        </Text>
      </View>

      {/* Username */}
      <View className="w-11/12 gap-2">
        <Text className="text-lg font-PoppinsBold md:text-xl">
          {usernameTitle}
        </Text>
        <TextInput
          placeholder="Ex: John Doe"
          value={usernameValue}
          onChangeText={onUsernameChange}
          className="border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4 md:text-2xl font-PoppinsRegular"
        />
      </View>

      {/* Email */}
      <View className="w-11/12 gap-2">
        <Text className="text-lg font-PoppinsBold md:text-xl">
          {userEmailTitle}
        </Text>
        <TextInput
          placeholder="Ex: johndoe@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailValue}
          onChangeText={onEmailChange}
          className="border-[#D5DDE5] border-[1px] rounded-lg md:text-2xl bg-white p-4"
        />
      </View>

      {/* Password */}
      <View className="w-11/12">
        <Text className="text-lg font-PoppinsBold md:text-2xl">
          {userPasswordTitle}
        </Text>
        <Text className="text-sm font-PoppinsRegular md:text-xl">
          {passwordTitleDescription}
        </Text>

        <View className="flex flex-row items-center border-[#D5DDE5] border-[1px] bg-white rounded-lg p-2 justify-between">
          <TextInput
            placeholder="Password"
            secureTextEntry={!isToggled}
            value={passwordValue}
            onChangeText={onPasswordChange}
            className="md:text-2xl flex-1"
          />
          <TouchableOpacity onPress={() => setIsToggled(!isToggled)}>
            <Ionicons
              name={isToggled ? "eye" : "eye-off"}
              size={iconSize}
              color={"#919191"}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default UserInput;
