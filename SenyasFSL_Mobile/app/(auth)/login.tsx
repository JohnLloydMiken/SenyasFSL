import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import "@/global.css";
import Authbutton from "@/components/button";
import { router } from "expo-router";

export default function login() {
  const [changePassword, setChangePassword] = useState(false);
  const [sendEmail, setSendEmail] = useState<false | true | null>(null);
  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-80">
      <View className="w-11/12">
        <View className="my-4">
          <Text className="text-4xl md:text-5xl font-PoppinsBold text-center">
            Welcome back!
          </Text>
          <Text className="font-light text-2xl md:text-3xl text-center">
            It’s good to see you again.
          </Text>
        </View>
        <View className=" w-full">
          <Text className="text-xl md:text-2xl font-PoppinsBold mt-8 mb-4">
            Email
          </Text>
          <TextInput
            placeholder="Email"
            className="border-[1px] border-gray-400 rounded-md bg-white p-4 md:text-xl"
          />
          <Text className="text-xl mt-12 mb-4 font-PoppinsBold md:text-2xl">
            Password
          </Text>
          <TextInput
            placeholder="Password"
            className="border-[1px] border-gray-400 rounded-md bg-white p-4 md:text-xl"
            secureTextEntry
          />
        </View>
      </View>

      <View className="w-11/12 absolute bottom-16">
        <Authbutton content="LogIn" onPress={() => router.push("/welcome")} />
        <TouchableOpacity onPress={() => setChangePassword(!changePassword)}>
          <Text className="text-center font-PoppinsBold md:text-2xl text-[#626262]">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
      {changePassword && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-40"></View>
      )}
      {changePassword && (
        <View className="absolute w-11/12 top-1/2 -translate-y-1/2 z-50 rounded-3xl bg-[#FAF3E0] p-4">
          <TouchableOpacity onPress={() => setChangePassword(false)}>
            <Text className="font-PoppinsBold text-xl md:text-2xl text-[#FB990F]">
              Cancel
            </Text>
          </TouchableOpacity>

          <View className="w-full">
            <Text className="font-PoppinsBold text-2xl text-center md:text-3xl">
              Forgot Password?
            </Text>
            <Text className="font-PoppinsRegular text-sm md:text-lg text-center">
              Enter your email address to receive a code to reset your password.
            </Text>
          </View>

          <View className="w-full mb-2">
            <Text className="text-xl md:text-2xl font-PoppinsSemiBold mt-8 mb-4">
              Email
            </Text>
            <TextInput
              placeholder="Email"
              className="border-[1px] border-gray-400 rounded-md bg-white p-4 md:text-xl"
            />
          </View>
          {sendEmail ? (
            <Text className="text-2xl md:text-3xl text-green-500 font-PoppinsRegular text-center">
              Email has Sent!
            </Text>
          ) : (
            <Text className="text-2xl md:text-3xl text-red-500 font-PoppinsRegular text-center">
              Failed to Sent mail!
            </Text>
          )}
          <TouchableOpacity
            className="w-full bg-[#FB990F] rounded-2xl mt-2 p-4"
            onPress={() => setSendEmail(!sendEmail)}
          >
            <Text className="font-PoppinsBold text-center text-xl md:text-2xl text-white">
              Send Email
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
