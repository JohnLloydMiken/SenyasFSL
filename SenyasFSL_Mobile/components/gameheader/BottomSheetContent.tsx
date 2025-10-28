// src/components/gameheader/BottomSheetContent.tsx
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import type { ProcessedAchievement } from "./AchievementScreen"; // Import the new type
import FirebaseImage from "./FirebaseImage"; // Import the helper

type Props = {
  item: ProcessedAchievement | null; // Use the new type, 'type' prop is removed
};

const BottomSheetContent: React.FC<Props> = ({ item }) => {
  const { width } = useWindowDimensions();

  if (!item) {
    return null; // Render nothing if no item is selected
  }

  return (
    <View className="flex-1 p-4">
      {/* Detail Image (the banner) */}
      <View className="mb-4">
        <FirebaseImage
          uri={item.detailImage} // Use the detailImage property
          style={{ 
            width: width - 32, // Full width with padding
            height: 180,       // Adjust height as needed
            borderRadius: 8,
          }}
        />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-2">{item.title}</Text>
      
      {/* Category (if it exists) */}
      {item.category && (
        <Text className="text-lg text-gray-500 text-center mb-4">{item.category}</Text>
      )}

      {/* Description */}
      <Text className="text-base text-gray-700">{item.description}</Text>
    </View>
  );
};

export default BottomSheetContent;