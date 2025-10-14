import { View, Text } from 'react-native'
import React from 'react'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

interface User_InfoProps{
    xp:number,
    username: string,
    email: string,
}

const User_info: React.FC<User_InfoProps> = ({xp, username, email}) => {
  return (
    <View className="w-11/12">
          <Text className="text-[#1A6509] font-PoppinsBold text-2xl md:text-3xl">
            {xp} XP
          </Text>
          <MaskedView
            maskElement={
              <Text className="text-3xl md:text-4xl font-PoppinsBold text-center">
                {username}
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              <Text
                style={{ opacity: 0 }}
                className="text-3xl md:text-4xl font-PoppinsBold text-center"
              >
                {username}
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text className="text-center my-2 font-PoppinsRegular text-xl md:text-2xl">
            {email}
          </Text>
        </View>
  )
}

export default User_info