import { View, Text } from 'react-native'
import React from 'react'
import DictionaryCategories from '@/components/main_interface/DictionaryCategories'
import { router } from 'expo-router'
const dictionary = () => {
  return (
    <View className='flex-1 bg-white p-2'>
      <Text className='font-PoppinsBold text-3xl md:text-4xl my-3'>Categories:</Text>
      <DictionaryCategories />
    </View>
  )
}

export default dictionary