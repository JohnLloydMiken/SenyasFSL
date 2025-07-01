import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Authbutton from '@/components/button'
import { router } from 'expo-router'
export default function register_how() {
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8'>
      <Text className='text-2xl font-bold'>Here’s how you benefit</Text>
        <View className='w-11/12 bg-white rounded-lg p-4 gap-8'>
            <View className='flex justify-between items-center flex-row w-full '>
                <Image source={require('../../assets/images/bridge.png')}/>
                <View>
                    <Text className='font-bold text-xl'>Build bridges</Text>
                    <Text className='text-lg w-72 text-justify'>1.5 billion people live with hearing loss. Through FSL, you bridge language barriers with the Deaf Community.</Text>
                </View>
            </View>
             <View className='flex justify-between items-center flex-row w-full '>
                <Image source={require('../../assets/images/dumbell.png')}/>
                <View>
                    <Text className='font-bold text-xl'>Excellent brain exercise</Text>
                    <Text className='text-lg w-72 text-justify'>Learning FSL is a great way to exercise your brain, boost your memory, and stay sharp as you age.</Text>
                </View>
            </View>
            <View className='flex justify-between items-center flex-row w-full '>
                <Image source={require('../../assets/images/mountain.png')}/>
                <View>
                    <Text className='font-bold text-xl'>Challenge yourself</Text>
                    <Text className='text-lg w-72 text-justify'>Challenging yourself to learn FSL can give you a big sense of accomplishment. Best of all, it’s fun and easy to learn! </Text>
                </View>
            </View>
        </View>
        <View className='w-11/12 absolute bottom-12'>
              <Authbutton content='Next' onPress={()=>router.push('/register_last')}></Authbutton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})