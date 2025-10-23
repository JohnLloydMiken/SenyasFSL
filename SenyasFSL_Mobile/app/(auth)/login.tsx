import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import "@/global.css";
import Authbutton from "@/components/authentication/button";
import { router } from "expo-router";
import { loginUser } from "@/services/authService";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { Feather } from "@expo/vector-icons"; // ✅ 1. Import an icon library

export default function Login() {
  // Local UI state
  const [changePassword, setChangePassword] = useState(false);
  const [sendEmail, setSendEmail] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // ✅ 2. Add state for password visibility

  // Zustand store
  const { user, loading: authLoading } = useAuthStore();

  // ✅ Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email, password);

      router.push("/(auth)/welcome");
    } catch (err: any) {
      // ✅ Specific check for verification error
      if (err.code === "auth/email-not-verified") {
        Alert.alert(
          "Email Not Verified",
          "Please check your email and click the verification link before logging in."
        );
        setIsError(false); // Don't show the generic modal
      } else {
        setIsError(true); // Show generic modal for other errors (e.g., wrong password)
      }
      setEmail("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle forgot password
  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      Alert.alert("Missing Info", "Please enter your email.");
      return;
    }

    try {
      // await resetPassword(resetEmail); // implement in AuthService if needed
      setSendEmail(true);
      setTimeout(() => {
        setChangePassword(false);
        setSendEmail(null);
        setResetEmail("");
      }, 2000);
    } catch (err) {
      setSendEmail(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-80">
      {/* Title */}
      <View className="w-11/12">
        <View className="my-4">
          <Text className="text-4xl md:text-5xl font-PoppinsBold text-center">
            Welcome back!
          </Text>
          <Text className="font-light text-2xl md:text-3xl text-center">
            It’s good to see you again.
          </Text>
        </View>

        {/* Email & Password Fields */}
        <View className="w-full">
          <Text className="text-xl md:text-2xl font-PoppinsBold mt-8 mb-4">
            Email
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border-[1px] border-gray-400 rounded-md bg-white p-4 md:text-xl"
          />

          <Text className="text-xl mt-12 mb-4 font-PoppinsBold md:text-2xl">
            Password
          </Text>

          {/* ✅ 3. Create a container for the input and icon */}
          <View className="flex-row items-center border-[1px] border-gray-400 rounded-md bg-white pr-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible} // ✅ 4. Toggle secureTextEntry
              className="flex-1 p-4 md:text-xl" // Make input take most space
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"} // ✅ 5. Change icon based on state
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View className="w-11/12 absolute bottom-16">
        <TouchableOpacity disabled={isError || isLoading || authLoading}>
          <Authbutton
            content={isLoading || authLoading ? "Logging in..." : "Log In"}
            onPress={handleLogin}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setChangePassword(!changePassword)}
          disabled={isError || isLoading || authLoading}
        >
          <Text className="text-center font-PoppinsBold md:text-2xl text-[#626262]">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password Modal */}
      {changePassword && (
        <>
          <View className="absolute inset-0 bg-black/60 z-40" />
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
                Enter your email address to receive a code to reset your
                password.
              </Text>
            </View>

            <View className="w-full mb-2">
              <Text className="text-xl md:text-2xl font-PoppinsSemiBold mt-8 mb-4">
                Email
              </Text>
              <TextInput
                placeholder="Email"
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="border-[1px] border-gray-400 rounded-md bg-white p-4 md:text-xl"
              />
            </View>

            {sendEmail === true && (
              <Text className="text-2xl md:text-3xl text-green-500 font-PoppinsRegular text-center">
                Email has been sent!
              </Text>
            )}
            {sendEmail === false && (
              <Text className="text-2xl md:text-3xl text-red-500 font-PoppinsRegular text-center">
                Failed to send email!
              </Text>
            )}

            <TouchableOpacity
              onPress={handleSendResetEmail}
              className="w-full bg-[#FB990F] rounded-2xl mt-2 p-4"
            >
              <Text className="font-PoppinsBold text-center text-xl md:text-2xl text-white">
                Send Email
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Error Popup */}
      {isError && (
        <View className="absolute w-96 h-60 top-1/2 -translate-y-1/2 bg-white border border-[#FB990F] rounded-xl p-4 flex flex-col items-center justify-center gap-3">
          <Text className="text-red-500 text-center font-PoppinsBold text-4xl md:text-3xl">
            Failed to Login!
          </Text>
          <Text className="text-center font-PoppinsRegular text-xl md:text-2xl">
            Please check your Email and Password
          </Text>
          <TouchableOpacity onPress={() => setIsError(false)}>
            <Text className="text-center text-[#FB990F] mt-4 font-PoppinsBold text-2xl ">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
