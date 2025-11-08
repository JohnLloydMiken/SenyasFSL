import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResetProgress } from "@/hooks/useResetProgress"; // Import our new hook
import FSL_Wait from "@/assets/svgs/Wait.svg"
// Make sure to add this image to your assets


type ResetProgressModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ResetProgressModal: React.FC<ResetProgressModalProps> = ({
  visible,
  onClose,
}) => {
  const [securityInput, setSecurityInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: resetProgress,
    isPending: loading,
    error,
  } = useResetProgress();

  const isValid = securityInput === "RESET" && password.length > 0;

  // Reset fields when modal is opened
  useEffect(() => {
    if (visible) {
      setSecurityInput("");
      setPassword("");
      setShowPassword(false);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!isValid) return;

    resetProgress(password, {
      onSuccess: () => {
        onClose(); // Close modal on success
      },
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        className="flex-1 justify-center items-center p-4 bg-black/50"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()} // Prevent closing modal when pressing inside
          className="w-full max-w-md bg-[#FAF3E0] rounded-2xl p-6"
        >
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <Ionicons name="close-circle" size={32} color="#444" />
          </TouchableOpacity>

          <View className="w-full flex justify-center items-center">
            <FSL_Wait width={150} height={150} />
          </View>

          <Text className="text-center text-xl font-PoppinsBold mb-2 text-gray-900">
            Are you sure?
          </Text>
          <Text className="text-center text-sm text-gray-800 mb-6 px-2 font-PoppinsMedium">
            This action resets your progress and is irreversible. Please type{" "}
            <Text className="font-PoppinsBold text-red-600">“RESET”</Text> into
            the field below and enter your password.
          </Text>

          {error && (
            <Text className="text-center text-sm text-red-600 mb-4 font-PoppinsMedium">
              {(error as Error).message || "An unknown error occurred."}
            </Text>
          )}

          <View className="mb-4">
            <Text className="mb-1 font-PoppinsBold text-gray-800">
              Security field
            </Text>
            <TextInput
              placeholder="Type here..."
              value={securityInput}
              onChangeText={setSecurityInput}
              autoCapitalize="characters"
              className="w-full px-4 py-3 border border-[#D5DDE5] rounded-lg bg-white"
            />
          </View>

          <View className="mb-6">
            <Text className="mb-1 font-PoppinsBold text-gray-800">
              Current Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="w-full px-4 py-3 border border-[#D5DDE5] rounded-lg bg-white"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-full py-4 bg-[#FB990F] rounded-xl mb-3"
          >
            <Text className="text-white text-center font-PoppinsBold text-base">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isValid || loading}
            onPress={handleSubmit}
            className={`w-full py-3 rounded-xl border-[5px] ${
              isValid
                ? "border-red-600"
                : "border-gray-400 opacity-50"
            }`}
          >
            {loading ? (
              <ActivityIndicator color={isValid ? "red" : "gray"} />
            ) : (
              <Text
                className={`text-center font-PoppinsBold text-base ${
                  isValid ? "text-red-600" : "text-gray-400"
                }`}
              >
                Reset your progress
              </Text>
            )}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// You can use StyleSheet for the backdrop if you're not using nativewind for it
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
});

export default ResetProgressModal;