import { StyleSheet, Text, View, Image } from 'react-native'
import { router } from 'expo-router'
import React from 'react'

import Authbutton from '@/components/button'

const registerBG = require('../../assets/images/registerBG.png')
export default function register() {
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-16'>
        <Image source={registerBG}/>

        <View className='w-11/12 flex justify-center items-center flex-col'>
          <Text className='text-3xl font-bold'>Hi, I’m Senyas!</Text>
          <Text className='text-center text-xl'>Nice to meet you! Let’s start your Filipino Sign Language journey.</Text>
        </View>

        <View className='w-11/12'>
          <Authbutton content='Next' onPress={()=> router.push('./register_whyFSL')}/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})