import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import UserStreak from '@/modules/userStreak'


export default function profile() {
  return (
    <ScrollView className='bg-[#FFFBF1] flex-1 ' contentContainerStyle ={{alignItems: 'center', display: "flex", flexDirection: 'column'}}>
          {/* User name,xp ,streak */}
        <View>
          <Text>115XP</Text>
            <MaskedView maskElement={<Text className="text-3xl font-PoppinsBold ">Username</Text> } >
              <LinearGradient
                colors={['#FB990F', '#EA0505']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
                >
                {/* Invisible text only to preserve size */}
                <Text style={{ opacity: 0 }} className='text-3xl font-PoppinsBold  '> Username</Text>
              </LinearGradient>
            </MaskedView>
            <Text>Email</Text>
        </View>

        <UserStreak streakCount={1} protectionCount={1}/>
       

                   {/* User Account */}

      <View>
        <Text></Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})