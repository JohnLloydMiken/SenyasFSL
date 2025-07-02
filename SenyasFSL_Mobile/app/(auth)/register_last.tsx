import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Authbutton from '@/components/button'
import { router } from 'expo-router'
export default function register_last() {
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col'>
      <Image source={require('../../assets/images/last.png')} className='mt-8'/>
      <View className='w-11/12'>
        <Text className='text-3xl font-bold text-center mb-2'>Last step!</Text>
        <Text className='text-center text-xl'>Get ready to join learning a Filipino Sign Language with SenyasFSL.</Text>
      </View>
      
       <View className='w-11/12 absolute bottom-12'>
              <Authbutton content='Commit to my goal' onPress={()=>router.push('/sign_up')}></Authbutton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})

