import React from "react"
import { TouchableOpacity, Text, Image, View } from "react-native"
import { iconMap } from "@/app/(main_interface)/treasure"
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
interface itemCardProps {
    itemName: string,
    itemCost: number,
    itemIcon: string
}

const Item: React.FC<itemCardProps> = ({itemName, itemCost, itemIcon}) =>{

    return(
        <LinearGradient
      colors={['#FB990F', '#EA0505']} // orange to red
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 3, // This controls the thickness of the border
        width: 120,
        height: 130,
      }}
    >

        <TouchableOpacity className="w-[101%] h-[98%] bg-[#FAF3E0] rounded-2xl p-4 flex justify-center items-center flex-col mx-auto my-0  gap-1">
            <Image source={iconMap[itemIcon]} className="w-12 h-12"/>
            <MaskedView
                maskElement={
                    <View className="w-full bg-transparent items-center">
                    <Text className="font-PoppinsBold text-sm text-center">
                        {itemName}
                    </Text>
                    </View>
                }
                >
                <LinearGradient
                    colors={['#2DE2E2', '#0922A0']}
                    start={{ x: 0, y: -0.1 }}
                    end={{ x: 0, y: 0.8 }}
                    className="w-full items-center"
                >
                    <Text className="font-PoppinsBold text-sm opacity-0">{itemName}</Text>
                </LinearGradient>
                </MaskedView>

          

            <View className="w-full flex justify-evenly items-center flex-row">
                <Image source={require('../assets/images/star.png')} />
                  <MaskedView
                    maskElement={
                        <View className="w-full bg-transparent items-center">
                        <Text className="font-PoppinsBold text-lg ">
                            {itemCost}
                        </Text>
                        </View>
                    }
                    >
                    <LinearGradient
                        colors={['#FB990F', '#EA0505']}
                        start={{ x: 0, y: -0.1 }}
                        end={{ x: 0, y: 0.8 }}
                        className="w-full items-center"
                    >
                        <Text className="font-PoppinsBold text-lg opacity-0">{itemCost}</Text>
                    </LinearGradient>
                </MaskedView>
            </View>
        </TouchableOpacity>

    </LinearGradient>
    )


}

 


    export default Item