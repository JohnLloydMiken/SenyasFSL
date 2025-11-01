// components/main_interface/treasure/Inventory.tsx
import React, { useMemo, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Bag from "@/assets/svgs/Bag.svg";
import { ItemInGame } from "./items"; // ✅ Imports your UI component
import InventoryCount from "./InventoryCount";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { useGameStore } from "@/hooks/useGameStore"; // ✅ Import game store
import { ItemId } from "@/shared/types/user"; // ✅ Import ItemId type

interface InventoryProps {
  onPress: () => void;
  onClose: () => void;
  isPressed: boolean;
}

const Inventory: React.FC<InventoryProps> = React.memo(
  ({ onPress, onClose, isPressed }) => {
    const { width } = useWindowDimensions();
    const svgSize = useMemo(() => (width < 768 ? 40 : 60), [width]);

    const { user } = useAuthStore();
    const { userData, loading: userLoading } = useUserStore();
    
    // ✅ Get the item functions from the game store
    const useItem = useGameStore((state) => state.useItem);
    const isUsingItem = useGameStore((state) => state.isUsingItem);

    const handlePress = useCallback(() => onPress(), [onPress]);
    const handleClose = useCallback(() => onClose(), [onClose]);

    // 🔹 Animation Refs (Your UI code)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    // 🔹 Trigger animation (Your UI code)
    useEffect(() => {
      if (isPressed) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isPressed, fadeAnim, slideAnim]);

    // ✅ *** LOGIC FIX 1: This array now has the correct IDs ***
    const items = useMemo(() => {
      if (!userData?.inventory) return [];
      const inv = userData.inventory;
      return [
        {
          id: "xpMultiply" as ItemId, // Correct ID
          name: "Potion",
          cost: 0, // Cost is 0 for "using"
          icon: "Potion",
          qty: inv.xpMultiply || 0,
        },
        {
          id: "twotry" as ItemId, // Correct ID
          name: "Retry",
          cost: 0,
          icon: "Retry",
          qty: inv.twotry || 0,
        },
        {
          id: "bomb" as ItemId, // Correct ID
          name: "Bomb",
          cost: 0,
          icon: "Bomb",
          qty: inv.bomb || 0,
        },
        {
          id: "skip" as ItemId, // Correct ID
          name: "Next",
          cost: 0,
          icon: "Next",
          qty: inv.skip || 0,
        },
      ];
      // Removed filter, so items with 0 qty will show (as in your file)
    }, [userData]);

    // ✅ This function calls the game store to use the item
    const handleItemPress = useCallback(
      (itemId: ItemId, itemCost: number) => { // Receives both
        if (userLoading || !userData?.inventory) return;

        // Calls the 'useItem' function from useGameStore
        // It ignores itemCost, which is 0 anyway
        useItem(itemId, userData.inventory).catch((err) => {
          console.error(
            `[Inventory] Failed to use item ${itemId}:`,
            err.message
          );
        });
      },
      [useItem, userLoading, userData]
    );

    if (userLoading) {
      return (
        <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!userData) {
      return (
        <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
          <Text>Could not load user profile. Please try again later.</Text>
        </View>
      );
    }

    return (
      <View className="w-full relative ">
        {/* 🔹 Animated Inventory Panel (Your UI) */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 50],
                }),
              },
            ],
          }}
        >
          {isPressed && (
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
              style={{
                width: "100%",
                borderRadius: 16,
                backgroundColor: "transparent",
                elevation: 5,
                padding: 2,
              }}
            >
              <View className="w-full bg-[#FAF3E0] rounded-2xl px-2 py-4">
                <View className="flex-row items-center justify-between mb-2">
                  <MaskedView
                    maskElement={
                      <Text className="font-PoppinsBold text-lg">Items</Text>
                    }
                  >
                    <LinearGradient
                      colors={["#FB990F", "#EA0505"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 0.8 }}
                    >
                      <Text className="font-PoppinsBold text-lg opacity-0">
                        Items
                      </Text>
                    </LinearGradient>
                  </MaskedView>

                  <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={svgSize - 5} color="#7C7C7C" />
                  </TouchableOpacity>
                </View>

                <View className="w-full flex-row flex-wrap gap-4 items-center justify-center">
                  {/* ✅ *** LOGIC FIX 2: Added missing props *** */}
                  {items.map((item) => (
                    <View key={item.id} className="gap-2 items-center">
                      <ItemInGame
                        itemName={item.name}
                        itemCost={item.cost}
                        itemIcon={item.icon}
                        itemId={item.id} // ✅ This was missing
                        onPress={handleItemPress} // ✅ This was missing
                        disabled={isUsingItem || item.qty <= 0} // ✅ Disable if 0
                      />
                      <InventoryCount number={item.qty} />
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>

        {/* 🔹 Floating Bag Button (Your UI) */}
        <TouchableOpacity
          onPress={handlePress}
          className={`absolute bottom-0 my-3 w-14 h-14 rounded-xl ${
            isPressed ? "opacity-0" : "opacity-100"
          }`}
        >
          <View
            className={`w-full h-[93%] rounded-xl flex justify-center items-center ${
              isPressed ? "bg-[#E6E2E2]" : "bg-[#FB990F]"
            }`}
          >
            <Bag
              width={svgSize}
              height={svgSize}
              color={isPressed ? "gray" : "white"}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

export default Inventory;