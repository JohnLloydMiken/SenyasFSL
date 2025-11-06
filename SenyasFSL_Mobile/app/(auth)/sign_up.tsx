import Informtaion from "@/assets/svgs/information.svg";
import Authbutton from "@/components/authentication/button";
import Modal_Privacy from "@/components/authentication/Modal_Privacy";
import Modal_Terms from "@/components/authentication/Modal_Terms";
import UserInput from "@/components/authentication/userInput";
import { mapAuthError, registerUser } from "@/services/AuthService"; // Import registerUser and mapAuthError
import { IconSize } from "@/utils/sizes";
import { userReason } from "@/utils/store/useUserStore"; // Import the store to get the reason
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const [isTermsPressed, setIsTermsPressed] = useState(false);
  const [isPrivacyPressed, setIsPrivacyPressed] = useState(false);

  // Input states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Get the reason from the Zustand store
  const { reason } = userReason();

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle the sign-up logic
  const handleSignUp = async () => {
    // 1. Check for empty fields
    if (!username || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      setIsError(true);
      return;
    }

    // 2. Reset UI and start loading
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      // 3. Call the registerUser function from authService
      await registerUser({
        email: email.trim(),
        password: password, // Passwords typically aren't trimmed
        username: username.trim(),
        reason: reason || "Other", // Use selected reason or fallback
      });

      // 4. On success, navigate to the congratulations screen
      router.push("/(auth)/congrast");
    } catch (error: any) {
      // 5. On failure, map the error and show the modal
      console.error("Sign up failed:", error);
      setErrorMessage(mapAuthError(error));
      setIsError(true);
    } finally {
      // 6. Stop loading
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8">
      <UserInput
        title="Sign up for free and start learning!"
        usernameTitle="Username"
        userEmailTitle="Email"
        userPasswordTitle="Password"
        passwordTitleDescription="At least 6 characters"
        usernameValue={username}
        emailValue={email}
        passwordValue={password}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />

      {/* Terms & Privacy */}
      <View className="w-10/12 bg-[#FFEEB9] flex flex-row items-start p-4 rounded-lg gap-4">
        <Informtaion width={IconSize()} height={IconSize()} />

        <View className="flex flex-wrap flex-row items-center gap-x-1 w-10/12">
          <Text className="text-sm md:text-xl">By signing up, you accept our</Text>
          <TouchableOpacity onPress={() => setIsTermsPressed(true)}>
            <Text className="text-sm md:text-xl font-PoppinsBold underline">
              Terms and Conditions
            </Text>
          </TouchableOpacity>
          <Text className="text-sm md:text-xl">and</Text>
          <TouchableOpacity onPress={() => setIsPrivacyPressed(true)}>
            <Text className="text-sm md:text-xl font-PoppinsBold underline">
              Privacy Policy.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-11/12 absolute bottom-12">
        {/* Updated Authbutton with onPress handler and loading state */}
        <Authbutton
          content={isLoading ? "Signing up..." : "Commit to my goal"}
          onPress={handleSignUp}
          
        />
      </View>

      {/* Modals */}
      {isTermsPressed && <Modal_Terms />}
      {isPrivacyPressed && <Modal_Privacy />}

      {/* Error Modal */}
      {isError && (
        <View className="absolute w-96 h-60 top-1/2 -translate-y-1/2 bg-white border border-[#FB990F] rounded-xl p-4 flex flex-col items-center justify-center gap-3 z-50">
          <Text className="text-red-500 text-center font-PoppinsBold text-4xl md:text-3xl">
            Failed to Sign up!
          </Text>
          <Text className="text-center font-PoppinsRegular text-xl md:text-2xl">
            {errorMessage}
          </Text>
          <TouchableOpacity onPress={() => setIsError(false)}>
            <Text className="text-center text-[#FB990F] mt-4 font-PoppinsBold text-2xl">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});