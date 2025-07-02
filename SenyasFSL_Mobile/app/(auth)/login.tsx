import {  Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import "@/global.css"
import Authbutton from '@/components/button'
import { router } from 'expo-router'

export default function login() {
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-80'>
      <View className='w-11/12'>
          <View className='my-4' >
              <Text className='text-4xl font-bold text-center'>Welcome back!</Text>
              <Text className='font-light text-2xl text-center'>It’s good to see you again.</Text>
          </View>
          <View className=' w-full'>
              <Text className='text-xl mt-8 mb-4'>Email</Text>
              <TextInput placeholder='Email' className='border-[1px] border-gray-400 rounded-md bg-white p-4'/>
              <Text className='text-xl mt-12 mb-4'>Password</Text>
              <TextInput placeholder='Password' className='border-[1px] border-gray-400 rounded-md bg-white p-4' secureTextEntry/>
          </View>
      </View>

      <View className='w-11/12'>
        <Authbutton content='LogIn' onPress={()=> router.push('/welcome')}/>
        <TouchableOpacity><Text className='text-center'>Forgot Password?</Text></TouchableOpacity>
      </View>
       
    </View>
  )
}

