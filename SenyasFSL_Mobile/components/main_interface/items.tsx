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

interface itemCardProps {
  itemName: string;
  itemCost: number;
  itemIcon: string;
  inGame?: boolean; // optional flag for the smaller version
}

const svgMap: { [key: string]: any } = {
  Protection,
  Potion,
  Next,
  Retry,
  Bomb,
};

// ✅ define gradients as readonly tuples
const borderGradient = ["#FB990F", "#EA0505"] as const;
const textGradient = ["#2DE2E2", "#0922A0"] as const;
const costGradient = ["#FB990F", "#EA0505"] as const;

const Item: React.FC<itemCardProps> = ({ itemName, itemCost, itemIcon }) => {
  const SvgIcon = svgMap[itemIcon];
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const svgStar = width < 768 ? 24 : 30;
  const containerWidth = width < 768 ? 120 : 150;
  const containerHeight = width < 768 ? 130 : 160;

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
      <TouchableOpacity className="w-[101%] h-[98%] bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0 gap-1">
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

// ✅ smaller in-game version
export const ItemInGame: React.FC<itemCardProps> = ({
  itemName,
  itemCost,
  itemIcon,
}) => {
  const SvgIcon = svgMap[itemIcon];
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 20 : 50;
  const svgStar = width < 768 ? 15 : 30;
  const containerWidth = width < 768 ? 80 : 120;
  const containerHeight = width < 768 ? 80 : 120;

  return (
    <LinearGradient
      colors={borderGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 2,
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <TouchableOpacity className="w-full h-full bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0 gap-1">
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

// ✅ memoize for perf
export default memo(Item);
