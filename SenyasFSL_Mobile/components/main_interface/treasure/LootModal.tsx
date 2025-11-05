// components/main_interface/LootModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Define the prize prop type
interface Prize {
  id: string;
  name: string;
}

interface LootModalProps {
  prize: Prize | null;
  onClose: () => void;
}

// Simple emoji icons for items
const itemIcons: { [key: string]: string } = {
  xpMultiply: "🧪",
  bomb: "💣",
  skip: "⏭️",
  twotry: "🔄",
  streakProtect: "🛡️",
};

export default function LootModal({ prize, onClose }: LootModalProps) {
  if (!prize) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={!!prize}>
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="bg-[#FAF3E0] w-full max-w-sm p-6 rounded-2xl items-center shadow-lg">
          {/* 🎁 Replaced Lottie with a simple banner */}
          <View className="bg-white/80 rounded-full w-32 h-32 justify-center items-center mb-2">
            <Text className="text-6xl">🎁</Text>
          </View>

          {/* Title */}
          <Text className="font-PoppinsBold text-2xl md:text-3xl text-gray-900 mt-2">
            You won!
          </Text>

          {/* Prize Display */}
          <View className="my-4 p-4 bg-white/70 rounded-lg items-center w-full">
            <Text className="text-6xl">{itemIcons[prize.id] || "🎁"}</Text>
            <Text className="font-PoppinsSemiBold text-xl md:text-2xl text-gray-800 mt-2">
              You received 1 × {prize.name}!
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className="w-full p-3 bg-[#27D700] rounded-xl mt-2"
            onPress={onClose}
          >
            <Text className="font-PoppinsBold text-white text-lg md:text-xl text-center">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
