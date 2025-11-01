import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import "@/global.css";
import Authbutton from "@/components/authentication/button";
import { loginUser, mapAuthError } from "@/services/authService"; // Already imported
import { useAuthStore } from "@/utils/store/useAuthStore";
import { Feather } from "@expo/vector-icons";
import { sendPasswordResetEmail, signOut } from "firebase/auth"; // 👈 1. ADDED signOut
import { auth, db } from "@/firebaseConfig"; // 👈 2. ADDED db
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore"; // 👈 3. ADDED doc and getDoc

export default function Login() {
  // Local UI state
  const [changePassword, setChangePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Zustand store
  const { loading: authLoading } = useAuthStore();

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ 1. Use your custom loginUser service.
      await loginUser(email, password);

      // --- START: NEW ADMIN CHECK LOGIC ---

      // 2. Get the newly authenticated user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Failed to get user after login.");
      }

      // 3. Fetch their Firestore document to check their role
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // This is a safety check. If they have an auth account but no
        // firestore doc, something is wrong. Log them out.
        await signOut(auth);
        throw new Error("User profile not found. Please contact support.");
      }

      // 4. CHECK THE ROLE
      const userRole = userDoc.data()?.role;

      if (userRole === "admin") {
        // 5. IF ADMIN: Show message, log out, and stop.
        await signOut(auth); // Log them out of the mobile app
        Toast.show({
          type: "error",
          text1: "Admin Account",
          text2:
            "Please use the web dashboard at https://iron-gizmo-471110-d0.web.app",
          position: "bottom",
          visibilityTime: 8000, // Show for 8 seconds
        });
        setEmail("");
        setPassword("");
      } else {
        // 6. IF USER: Proceed to the welcome screen as normal
        router.push("/(auth)/welcome");
      }
      // --- END: NEW ADMIN CHECK LOGIC ---

    } catch (err: any) {
      // This will now also catch the errors from the admin check
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: mapAuthError(err), // Use the error mapper
        position: "bottom",
      });
      setEmail("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      Alert.alert("Missing Info", "Please enter your email.");
      return;
    }

    setIsLoading(true); 
    try {
      await sendPasswordResetEmail(auth, resetEmail);

      Toast.show({
        type: "success",
        text1: "Email Sent!",
        text2: "Please check your inbox for a reset link.",
        position: "bottom",
      });

      // Close modal on success
      setChangePassword(false);
      setResetEmail("");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Send",
        text2: mapAuthError(err),
        position: "bottom",
      });
    } finally {
      setIsLoading(false); // Stop loading
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

          {/* Password Input with Visibility Toggle */}
          <View className="flex-row items-center border-[1px] border-gray-400 rounded-md bg-white pr-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              className="flex-1 p-4 md:text-xl"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View className="w-11/12 absolute bottom-16">
        <TouchableOpacity disabled={isLoading || authLoading}>
          <Authbutton
            content={isLoading || authLoading ? "Logging in..." : "Log In"}
            onPress={handleLogin}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setChangePassword(!changePassword)}
          disabled={isLoading || authLoading}
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
                Enter your email address to receive a link to reset your
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

            <TouchableOpacity
              onPress={handleSendResetEmail}
              disabled={isLoading} // Disable button while sending
              className="w-full bg-[#FB990F] rounded-2xl mt-2 p-4"
            >
              <Text className="font-PoppinsBold text-center text-xl md:text-2xl text-white">
                {isLoading ? "Sending..." : "Send Email"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}