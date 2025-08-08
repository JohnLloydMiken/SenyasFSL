import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'


interface Count{
    number: number
}
const InventoryCount: React.FC <Count> = ({number}) => {
  return (
      <LinearGradient
                  colors={["#FB990F", "#EA0505"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.8 }}
                  style={{
                    width: 80,
                    borderRadius: 50,
                    backgroundColor: "trasnparent",
                    padding: 2,
                  }}
                >
                    <View className='bg-white rounded-full '>
                        <MaskedView
                                        maskElement={
                                          <Text className="font-PoppinsBold text-lg text-center"> {number}x </Text>
                                        }
                                      >
                                        <LinearGradient
                                          colors={["#FB990F", "#EA0505"]}
                                          start={{ x: 0, y: 0 }}
                                          end={{ x: 0, y: 0.8 }}
                                        >
                                          {/* Invisible text only to preserve size */}
                                          <Text className="font-PoppinsBold text-lg opacity-0 text-center">
                                            {" "}
                                            {number}x{" "}
                                          </Text>
                                        </LinearGradient>
                                      </MaskedView>
                    </View>
                </LinearGradient>
  )
}

export default InventoryCount