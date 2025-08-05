import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React,{useState} from "react";
import Bag from "@/assets/svgs/Bag.svg";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { ItemInGame } from "./items";
import InventoryCount from "./InventoryCount";
import BABGBW from '@/assets/svgs/BAGBW.svg'
interface InventoryProps {
  onPress: () => void;
  onClose: ()=> void
  XpPotion: number;
  Bomb: number;
  Skip: number;
  Retry: number;
  isPressed: boolean;
}

const Inventory: React.FC<InventoryProps> = ({
  onPress,
  XpPotion,
  Bomb,
  Skip,
  Retry,
  isPressed,
  onClose
}) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 40 : 60;
  
  return (
    <View className="w-full relative ">
      {isPressed && (
        <LinearGradient
          colors={["#FB990F", "#EA0505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={{
            width: "100%",
            borderRadius: 16,
            backgroundColor: "trasnparent",
            elevation: 5,
            padding: 2,
          }}
        >
          <View className="w-full bg-[#FAF3E0] rounded-2xl px-2 py-4">
            <View className="flex-row items-center justify-between">
              <MaskedView
                maskElement={
                  <Text className="font-PoppinsBold text-lg"> Items </Text>
                }
              >
                <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                >
                  {/* Invisible text only to preserve size */}
                  <Text className="font-PoppinsBold text-lg opacity-0">
                    {" "}
                    Items{" "}
                  </Text>
                </LinearGradient>
              </MaskedView>

              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={svgSize - 5} color={"#7C7C7C"} />
              </TouchableOpacity>
            </View>

            <View className="w-full flex-row flex-wrap gap-4 items-center justify-center">
              <View className="gap-2 ">
                <ItemInGame
                  itemName="Potion"
                  itemCost={350}
                  itemIcon="Potion"
                />
                <InventoryCount number={XpPotion} />
              </View>

              <View className="gap-2 ">
                <ItemInGame
                  itemName="Retry"
                  itemCost={25}
                  itemIcon="Retry"
                />
                <InventoryCount number={Retry} />
              </View>

              <View className="gap-2 ">
                <ItemInGame itemName="Bomb" itemCost={20} itemIcon="Bomb" />
                <InventoryCount number={Bomb} />
              </View>

              <View className="gap-2 ">
                <ItemInGame
                  itemName="Next"
                  itemCost={50}
                  itemIcon="Next"
                />
                <InventoryCount number={Skip} />
              </View>
            </View>
          </View>
        </LinearGradient>
      )}

      <TouchableOpacity
        onPress={onPress}
        className={` w-14 h-14 ${isPressed === true ? 'bg-black' : 'bg-red-600'} rounded-xl aboslute bottom-0 my-3`}
      >
        <View className={`w-full h-[93%] ${isPressed === true ? 'bg-[#E6E2E2]' : 'bg-[#FB990F]'} rounded-xl flex justify-center items-center`}>
         {isPressed === true ?  <Bag width={svgSize} height={svgSize} color={"gray"} /> :  <Bag width={svgSize} height={svgSize} color={"white"} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Inventory;
