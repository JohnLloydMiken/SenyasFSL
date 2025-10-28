// src/components/gameheader/FactItem.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import type { ProcessedAchievement } from "./AchievementScreen"; // Import the new type
import type { SvgProps } from "@/components/gameheader";
import FirebaseImage from "./FirebaseImage"; // Import the helper component

type Props = {
  fact: ProcessedAchievement;
  svgSize: number;
  lockedIcon: React.FC<SvgProps>; // This replaces svgMap
  onPress: (fact: ProcessedAchievement) => void;
};

const FactItem: React.FC<Props> = ({ fact, svgSize, lockedIcon: LockedIcon, onPress }) => {
  
  const renderIcon = () => {
    if (fact.unlocked) {
      // Unlocked: Show the image from the database
      return (
        <FirebaseImage
          uri={fact.image} // Use the 'image' property from the DB
          style={{ 
            width: svgSize, 
            height: svgSize, 
            borderRadius: svgSize / 2 // Or keep it square
          }}
        />
      );
    } else {
      // Locked: Show the locked icon component
      return <LockedIcon width={svgSize} height={svgSize} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(fact)}
      className="w-1/3 mb-4 flex flex-col items-center"
      accessible
      accessibilityLabel={`Fact: ${fact.title}`} // Use new prop 'title'
      accessibilityHint="Tap to view fact details"
    >
      <View style={{ width: svgSize, height: svgSize }} className="items-center justify-center">
        {renderIcon()}
      </View>

      <Text 
        className="text-center mt-2 text-sm font-medium" 
        numberOfLines={2}
        style={{ opacity: fact.unlocked ? 1 : 0.5 }} // Grey out locked items
      >
        {fact.title} {/* Use new prop 'title' */}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(FactItem);