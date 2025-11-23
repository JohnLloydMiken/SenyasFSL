// components/main_interface/treasure/items.tsx
import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Protection from "@/assets/svgs/Protection.svg";
import Retry from "@/assets/svgs/Retry.svg";
import Bomb from "@/assets/svgs/Bomb.svg";
import Next from "@/assets/svgs/Next.svg";
import Potion from "@/assets/svgs/Potion.svg";
import Star from "@/assets/svgs/Currency.svg";
import { ItemId } from "@/shared/types/user"; // ✅ Import the specific ItemId type

interface itemCardProps {
  itemName: string;
  itemCost: number;
  itemIcon: string;
  inGame?: boolean;
  itemId: ItemId; // ✅ Use the ItemId type
  onPress: (itemId: ItemId, itemCost: number) => void; // ✅ Use the ItemId type
  disabled?: boolean;
}

interface itemInGameProps {
  itemName: string;
  itemIcon: string;
  inGame?: boolean;
  itemId: ItemId; // ✅ Use the ItemId type
  onPress: (itemId: ItemId) => void; // ✅ Use the ItemId type
  disabled?: boolean;
}

const svgMap: { [key: string]: any } = {
  Protection,
  Potion,
  Next,
  Retry,
  Bomb,
};

const borderGradient = ["#FB990F", "#EA0505"] as const;
const textGradient = ["#2DE2E2", "#0922A0"] as const;
const costGradient = ["#FB990F", "#EA0505"] as const;

// This is the main Shop item
const Item: React.FC<itemCardProps> = ({
  itemName,
  itemCost,
  itemIcon,
  itemId,
  onPress,
  disabled = false,
}) => {
  const SvgIcon = svgMap[itemIcon];
  const { width } = useWindowDimensions();

  const svgSize = width < 768 ? 30 : 50;
  const svgStar = width < 768 ? 20 : 30;
  const containerWidth = width < 768 ? 100 : 175;
  const containerHeight = width < 768 ? 110 : 175;

  return (
    <LinearGradient
      colors={borderGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 3,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: "white",
        elevation: 5,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(itemId, itemCost)}
        disabled={disabled}
        className="w-[101%] h-[98%] bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0 gap-1"
      >
        {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
        <MaskedView
          maskElement={
            <View className="w-full bg-transparent items-center">
              <Text className="font-PoppinsBold text-sm md:text-xl text-center">
                {itemName}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={textGradient}
            start={{ x: 0, y: -0.1 }}
            end={{ x: 0, y: 0.8 }}
            className="w-full items-center"
          >
            <Text className="font-PoppinsBold text-sm md:text-xl opacity-0">
              {itemName}
            </Text>
          </LinearGradient>
        </MaskedView>

        <View className="w-full flex justify-evenly items-center flex-row md:justify-center md:gap-2">
          <Star width={svgStar} height={svgStar} />
          <MaskedView
            maskElement={
              <View className="w-full bg-transparent items-center">
                <Text className="font-PoppinsBold text-lg md:text-2xl">
                  {itemCost}
                </Text>
              </View>
            }
          >
            <LinearGradient
              colors={costGradient}
              start={{ x: 0, y: -0.1 }}
              end={{ x: 0, y: 0.8 }}
              className="w-full items-center"
            >
              <Text className="font-PoppinsBold text-lg opacity-0 md:text-2xl">
                {itemCost}
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// This is the smaller in-game version
export const ItemInGame: React.FC<itemInGameProps> = ({
  itemName,
  itemIcon,
  itemId,
  onPress,
  disabled = false,
}) => {
  const SvgIcon = svgMap[itemIcon];
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 40 : 50;
  const svgStar = width < 768 ? 15 : 30;
  const containerWidth = width < 768 ? 100 : 120;
  const containerHeight = width < 768 ? 100 : 120;

  return (
    <LinearGradient
      colors={borderGradient}
      style={{
        borderRadius: 16,
        padding: 2,
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(itemId)}
        disabled={disabled}
        className="w-full h-full bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0 gap-1"
      >
        {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
        <MaskedView
          maskElement={
            <View className="w-full bg-transparent items-center">
              <Text className="font-PoppinsBold text-sm md:text-xl text-center">
                {itemName}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={textGradient}
            start={{ x: 0, y: -0.1 }}
            end={{ x: 0, y: 0.8 }}
            className="w-full items-center"
          >
            <Text className="font-PoppinsBold text-sm md:text-xl opacity-0">
              {itemName}
            </Text>
          </LinearGradient>
        </MaskedView>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const TreasurePreview: React.FC<itemInGameProps> = ({
  itemName,
  itemIcon,
  itemId,
  onPress,
  disabled = true,
}) => {
  const SvgIcon = svgMap[itemIcon];
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 40 : 50;
  const svgStar = width < 768 ? 15 : 30;
  const containerWidth = width < 768 ? 100 : 120;
  const containerHeight = width < 768 ? 100 : 120;

  return (
    <LinearGradient
      colors={borderGradient}
      style={{
        borderRadius: 16,
        padding: 2,
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(itemId)}
        disabled={disabled}
        className="w-full h-full bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0 gap-1"
      >
        {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
        <MaskedView
          maskElement={
            <View className="w-full bg-transparent items-center">
              <Text className="font-PoppinsBold text-sm md:text-xl text-center">
                {itemName}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={textGradient}
            start={{ x: 0, y: -0.1 }}
            end={{ x: 0, y: 0.8 }}
            className="w-full items-center"
          >
            <Text className="font-PoppinsBold text-sm md:text-xl opacity-0">
              {itemName}
            </Text>
          </LinearGradient>
        </MaskedView>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default memo(Item);