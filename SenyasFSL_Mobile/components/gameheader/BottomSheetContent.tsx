// src/components/BottomSheetContent.tsx
import React from "react";
import { View, Text } from "react-native";
import type { SelectedItem, ItemType, Award, Fact } from "@/components/gameheader";

type Props = {
  item: SelectedItem;
  type: ItemType | null;
};

/**
 * Simple type guards
 */
const isAward = (i: SelectedItem): i is Award => !!i && (i as Award).award_title !== undefined;
const isFact = (i: SelectedItem): i is Fact => !!i && (i as Fact).Fact_title !== undefined;

const BottomSheetContent: React.FC<Props> = ({ item, type }) => {
  if (!item || !type) return null;

  if (type === "award" && isAward(item)) {
    const award = item;
    return (
      <View className="p-4">
        <Text className="text-xl font-bold mb-4">{award.award_title}</Text>
        <Text className="text-base mb-4 leading-6">{award.description || "This is an achievement award!"}</Text>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="font-semibold">Requirements:</Text>
          <Text className="mt-2">{award.requirements || "Complete specific tasks to unlock this award."}</Text>
        </View>

        {award.unlocked && (
          <View className="bg-green-100 p-4 rounded-lg mt-4">
            <Text className="text-green-800 font-semibold">🎉 Congratulations! Award Unlocked!</Text>
            <Text className="text-green-700 mt-1">Earned on: {award.dateEarned || "Today"}</Text>
          </View>
        )}
      </View>
    );
  }

  if (type === "fact" && isFact(item)) {
    const fact = item;
    return (
      <View className="p-4">
        <Text className="text-xl font-bold mb-4">{fact.Fact_title}</Text>

        {fact.unlocked ? (
          <>
            <Text className="text-base mb-4 leading-6">
              {fact.content ||
                "The Personal Flotation Device (PFD) is a critical safety equipment that helps keep you afloat in water. It's designed to provide buoyancy and increase your chances of survival in aquatic emergencies."}
            </Text>

            <View className="bg-blue-50 p-4 rounded-lg">
              <Text className="font-semibold text-blue-800">Did you know?</Text>
              <Text className="text-blue-700 mt-2">
                {fact.funFact || "PFDs can support up to 22 pounds of buoyancy and are required by law on most watercraft!"}
              </Text>
            </View>
          </>
        ) : (
          <View className="bg-gray-100 p-4 rounded-lg">
            <Text className="text-gray-600 text-center">🔒 This fact is locked</Text>
            <Text className="text-gray-500 text-center mt-2">Complete more activities to unlock this interesting fact!</Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};

export default React.memo(BottomSheetContent);
