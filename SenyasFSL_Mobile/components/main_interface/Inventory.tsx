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
import { ItemInGame } from "./items";
import InventoryCount from "./InventoryCount";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";

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

    const handlePress = useCallback(() => onPress(), [onPress]);
    const handleClose = useCallback(() => onClose(), [onClose]);

    // 🔹 Animation Refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    // 🔹 Trigger animation on open/close
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

    const items = useMemo(
      () => [
        {
          name: "Potion",
          cost: 350,
          icon: "Potion",
          qty: userData?.inventory?.xpMultiply ?? 0,
        },
        {
          name: "Retry",
          cost: 25,
          icon: "Retry",
          qty: userData?.inventory?.twotry ?? 0,
        },
        {
          name: "Bomb",
          cost: 20,
          icon: "Bomb",
          qty: userData?.inventory?.bomb ?? 0,
        },
        {
          name: "Next",
          cost: 50,
          icon: "Next",
          qty: userData?.inventory?.skip ?? 0,
        },
      ],
      [userData]
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
      <View className="w-11/12 relative mx-auto">
        {/* 🔹 Animated Inventory Panel */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 50], // slides slightly up
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
                  {items.map((item) => (
                    <View key={item.name} className="gap-2 items-center">
                      <ItemInGame
                        itemName={item.name}
                        itemCost={item.cost}
                        itemIcon={item.icon}
                      />
                      <InventoryCount number={item.qty} />
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>

        {/* 🔹 Floating Bag Button */}
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
