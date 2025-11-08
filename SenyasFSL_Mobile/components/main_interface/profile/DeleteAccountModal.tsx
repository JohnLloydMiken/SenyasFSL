// @/components/main_interface/profile/DeleteAccountModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Using Expo for icons
import FSL_Wait from "@/assets/svgs/Wait.svg"
type DeleteAccountModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [securityInput, setSecurityInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = securityInput === "DELETE" && password.trim().length > 0;

  // Reset state when modal is opened
  useEffect(() => {
    if (visible) {
      setSecurityInput("");
      setPassword("");
      setShowPassword(false);
      setIsLoading(false);
      setError("");
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!isValid) return;

    setError("");
    setIsLoading(true);
    try {
      await onConfirm(password);
      // If onConfirm is successful, the parent will close the modal
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-black/50 p-4"
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()} // Prevent closing modal when pressing content
        >
        <View className="w-full flex- justify-center items-center">
              <FSL_Wait width={150} height={150}/>
        </View>

          <Text className="font-PoppinsBold text-2xl text-center text-gray-900 mb-2">
            Wait, don't go!
          </Text>
          <Text className="font-PoppinsMedium text-base text-center text-gray-700 mb-6">
            This action is irreversible. Please type{" "}
            <Text className="font-PoppinsBold text-red-600">"DELETE"</Text> and
            enter your current password to confirm.
          </Text>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="font-PoppinsMedium text-sm text-red-700 text-center">
                {error}
              </Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="font-PoppinsBold text-sm text-gray-800 mb-2">
              Type "DELETE" to confirm
            </Text>
            <TextInput
              placeholder="DELETE"
              value={securityInput}
              onChangeText={setSecurityInput}
              autoCapitalize="characters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-PoppinsMedium text-base"
            />
          </View>

          <View className="mb-6">
            <Text className="font-PoppinsBold text-sm text-gray-800 mb-2">
              Current Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-PoppinsMedium text-base"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-full p-4 border-4 border-[#FB990F] rounded-xl mb-3"
          >
            <Text className="font-PoppinsBold text-[#FB990F] text-xl text-center">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isValid || isLoading}
            className={`w-full p-4 border-4 rounded-xl ${
              isValid
                ? "border-red-600"
                : "border-gray-400 opacity-50"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color={isValid ? "#DC2626" : "#9CA3AF"} />
            ) : (
              <Text
                className={`font-PoppinsBold text-xl text-center ${
                  isValid ? "text-red-600" : "text-gray-400"
                }`}
              >
                Delete your account
              </Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteAccountModal;