// src/components/AwardItem.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

// Import the new type from where it's defined (AchievementScreen)
import type { ProcessedAchievement } from "./AchievementScreen"; // Adjust path if needed
import type { SvgProps } from "@/components/gameheader";

// Import the helper component to load images from gs:// URLs
import FirebaseImage from "./FirebaseImage"; // Adjust path as needed

type Props = {
  award: ProcessedAchievement;
  svgSize: number;
  lockedIcon: React.FC<SvgProps>; // This replaces svgMap
  onPress: (award: ProcessedAchievement) => void;
};

const AwardItem: React.FC<Props> = ({ award, svgSize, lockedIcon: LockedIcon, onPress }) => {
  
  // Decide what to render: the locked icon or the unlocked image
  const renderIcon = () => {
    if (award.unlocked) {
      // If unlocked, show the image from the database.
      // We use FirebaseImage to handle the gs:// URL.
      return (
        <FirebaseImage
          uri={award.image}
          style={{ 
            width: svgSize, 
            height: svgSize, 
            borderRadius: svgSize / 2 // Make it circular
          }}
        />
      );
    } else {
      // If locked, show the locked icon component
      return <LockedIcon width={svgSize} height={svgSize} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(award)}
      className="w-1/3 mb-4 flex flex-col items-center"
      accessible
      accessibilityLabel={`Award: ${award.title}`} // Use new prop 'title'
      accessibilityHint="Tap to view award details"
      // You can optionally disable tapping on locked items
      // disabled={!award.unlocked}
    >
      {/* This View ensures consistent sizing for both SVG and Image */}
      <View style={{ width: svgSize, height: svgSize }} className="items-center justify-center">
        {renderIcon()}
      </View>

      <Text 
        className="text-center mt-2 text-sm font-medium" 
        numberOfLines={2}
        // Optionally make locked items' text greyed out
        style={{ opacity: award.unlocked ? 1 : 0.5 }}
      >
        {award.title} {/* Use new prop 'title' */}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(AwardItem);