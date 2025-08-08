import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useState } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Money from "@/assets/svgs/Currency.svg";
type CurrencyProps = {
  number: number;
};

const Currency: React.FC<CurrencyProps> = ({ number }) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 24 : 35;
  return (
    <View className="flex flex-row items-center  justify-center ml-4">
      <Money width={svgSize} height={svgSize} />
      <MaskedView
        maskElement={
          <Text className="font-PoppinsBold text-lg md:text-2xl mt-1 ml-2">
            {number}
          </Text>
        }
      >
        <LinearGradient
          colors={["#FB990F", "#EA0505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
        >
          {/* Invisible text only to preserve size */}
          <Text
            style={{ opacity: 0 }}
            className="font-PoppinsBold text-lg md:text-2xl mt-1 ml-2"
          >
            {number}
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

export default Currency;

const styles = StyleSheet.create({});
