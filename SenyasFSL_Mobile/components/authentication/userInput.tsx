import {
  useWindowDimensions,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
interface userInputProps {
  title: string;
  usernameTitle: string;
  userEmailTitle: string;
  userPasswordTitle: string;
  passwordTitleDescription: string;
}

const UserInput: React.FC<userInputProps> = ({
  title,
  usernameTitle,
  userEmailTitle,
  userPasswordTitle,
  passwordTitleDescription,
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
      <View className="w-11/12 gap-2">
        <Text className="text-lg font-PoppinsBold md:text-xl">
          {usernameTitle}
        </Text>
        <TextInput
          placeholder="Ex: john doe"
          className="border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4 md:text-2xl font-PoppinsRegular"
        />
      </View>
      <View className="w-11/12 gap-2">
        <Text className="text-lg font-PoppinsBold md:text-xl">
          {userEmailTitle}
        </Text>
        <TextInput
          placeholder="Ex: johndoe@example.com"
          className="border-[#D5DDE5] border-[1px] rounded-lg md:text-2xl bg-white p-4"
        />
      </View>
      <View className="w-11/12">
        <Text className="text-lg font-PoppinsBold md:text-2xl">
          {userPasswordTitle}
        </Text>
        <Text className="text-sm font-PoppinsRegular md:text-xl">
          {passwordTitleDescription}
        </Text>

        <View className=" flex flex-row items-center border-[#D5DDE5] border-[1px] bg-white rounded-lg p-2 justify-between">
          <TextInput
            placeholder="Password"
            secureTextEntry={!isToggled}
            className="md:text-2xl"
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
