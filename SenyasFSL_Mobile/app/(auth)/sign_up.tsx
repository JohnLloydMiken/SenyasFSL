import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Authbutton from "@/components/authentication/button";
import React from "react";
import { router } from "expo-router";
import { useState } from "react";
import UserInput from "@/components/authentication/userInput";
import Modal_Terms from "@/components/authentication/Modal_Terms";
import Modal_Privacy from "@/components/authentication/Modal_Privacy";
import Informtaion from "@/assets/svgs/information.svg";
export default function sign_up() {
  const [isTermsPressed, setIsTermsPressed] = useState(false);
  const [isPrivacyPressed, setIsPrivacyPressed] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 25 : 50;
  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8">
      <UserInput
        title="Sign up for free and start learning!"
        usernameTitle="Username"
        userEmailTitle="Email"
        userPasswordTitle="Password"
        passwordTitleDescription="At least 6 characters"
      />

      <View className="w-10/12 bg-[#FFEEB9] flex flex-row items-start p-4 rounded-lg gap-4">
        <Informtaion width={svgSize} height={svgSize} />

        <View className="flex flex-wrap flex-row items-center gap-x-1 w-10/12">
          <Text className="text-sm md:text-xl">
            By signing up, you accept our
          </Text>

          <TouchableOpacity onPress={() => setIsTermsPressed(!isTermsPressed)}>
            <Text className="text-sm md:text-xl font-PoppinsBold underline">
              Terms and Conditions
            </Text>
          </TouchableOpacity>

          <Text className="text-sm md:text-xl">and</Text>

          <TouchableOpacity
            onPress={() => setIsPrivacyPressed(!isPrivacyPressed)}
          >
            <Text className="text-sm md:text-xl font-PoppinsBold underline">
              Privacy Policy.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Commit to my goal"
          onPress={() => router.push("/congrast")}
        ></Authbutton>
      </View>

      {isTermsPressed ? <Modal_Terms /> : null}
      {isPrivacyPressed ? <Modal_Privacy /> : null}
    </View>
  );
}

const styles = StyleSheet.create({});
