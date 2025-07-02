import { StyleSheet, Text, View , Image, StatusBar} from 'react-native'
import React from 'react'
import Authbutton from '@/components/button'
import { router } from 'expo-router'
export default function congrast() {
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8' style={{paddingTop: StatusBar.currentHeight}}>
        <View className='w-11/12  mt-4'>
            <Text className='text-3xl font-bold text-center'>Congratulations!</Text>
            <Text className='text-2xl font-bold text-[#FB990F] text-center'>You've successfully signed up</Text>
        </View>
        <Image source={require('../../assets/images/registerBG.png')}/>
         <View className='w-10/12 '>
            <Text className='text-center text-lg'>We’re excited to see you join our mission to bridge language barriers through FSL.</Text>
            
        </View>
         <View className='w-11/12 absolute bottom-12'>
              <Authbutton content='Get Started' onPress={()=>router.push('/')}></Authbutton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})