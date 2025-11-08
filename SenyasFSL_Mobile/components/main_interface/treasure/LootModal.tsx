// components/main_interface/LootModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

// --- CHANGED ---
// Import SVGs as components
// Make sure you have 'react-native-svg' and 'react-native-svg-transformer' set up
import PotionIcon from "@/assets/svgs/Potion.svg";
import BombIcon from "@/assets/svgs/Bomb.svg";
import NextIcon from "@/assets/svgs/Next.svg";
import RetryIcon from "@/assets/svgs/Retry.svg";
import ProtectionIcon from "@/assets/svgs/Protection.svg";

// Define the prize prop type
interface Prize {
  id: string;
  name: string;
}

interface LootModalProps {
  prize: Prize | null;
  onClose: () => void;
}

// --- CHANGED ---
// Update the map to store the imported SVG components
const itemIcons: { [key: string]: React.ComponentType<SvgProps> } = {
  xpMultiply: PotionIcon,
  bomb: BombIcon,
  skip: NextIcon,
  twotry: RetryIcon,
  streakProtect: ProtectionIcon,
};

export default function LootModal({ prize, onClose }: LootModalProps) {
  if (!prize) return null;

  // --- CHANGED ---
  // Get the specific Icon component from the map
  const IconComponent = itemIcons[prize.id];

  return (
    <Modal animationType="fade" transparent={true} visible={!!prize}>
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        {/* --- CHANGED ---
            Updated container style to match image (white bg, orange border)
        */}
        <View className="bg-white w-full max-w-sm p-6 rounded-2xl items-center shadow-lg border-4 border-orange-400">
          
          {/* --- NEW ---
              Icon display (renders the SVG component)
              The shield icon in the image is blue; you might need to
              edit your Protection.svg to set its color, or add a 'color' prop
              if the SVG is set up to use 'currentColor'.
          */}
          <View className="mb-3">
            {IconComponent ? (
              // Use a size that fits the new layout
              <IconComponent width={80} height={80} />
            ) : (
              // Fallback emoji
              <Text className="text-6xl">🎁</Text>
            )}
          </View>

          {/* --- NEW ---
              "You got:" text from image
          */}
          <Text className="font-PoppinsMedium text-lg text-gray-600">
            You got:
          </Text>

          {/* --- CHANGED ---
              Prize Name text styled to match image (blue, bold)
          */}
          <Text className="font-PoppinsBold text-3xl text-blue-600 mt-1 mb-6">
            {prize.name}
          </Text>

          {/* --- CHANGED ---
              Button styled to match image (orange bg, "Got it!" text)
          */}
          <TouchableOpacity
            className="w-full p-3 bg-orange-500 rounded-xl"
            onPress={onClose}
          >
            <Text className="font-PoppinsBold text-white text-lg text-center">
              Got it!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}