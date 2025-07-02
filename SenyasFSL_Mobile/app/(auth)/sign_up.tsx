import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import Authbutton from '@/components/button'
import React from 'react'
import { router } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import Modal_Terms from '@/components/Modal_Terms'
import Modal_Privacy from '@/components/Modal_Privacy'
export default function sign_up() {

    const [isToggled, setIsToggled] = useState(false)
    const [isTermsPressed, setIsTermsPressed] = useState(false)
    const [isPrivacyPressed, setIsPrivacyPressed] = useState(false)

  return (

    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8'>
        <View className='w-11/12'>
            <Text className='text-2xl font-bold text-center'>Sign up for free and start learning!</Text>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                Username
            </Text>
            <TextInput placeholder='Username' className='border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4'/>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                Email
            </Text>
            <TextInput placeholder='Email' className='border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4'/>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                Password
            </Text>
            <Text className='text-sm'>At least 6 characters</Text>

           <View className=' flex flex-row items-center border-[#D5DDE5] border-[1px] bg-white rounded-lg p-2 justify-between'>
            <TextInput placeholder='Password' secureTextEntry ={!isToggled}/>
            <TouchableOpacity onPress={()=> setIsToggled(!isToggled)}>
                 <Ionicons name={isToggled ? 'eye' : 'eye-off'} size={20} color={'#919191'} />
            </TouchableOpacity>
           </View>
        </View>

        <View className='w-11/12 bg-[#FFEEB9] flex items-center justify-start p-4 flex-row rounded-lg gap-4'>
            <Image source={require('..//../assets//images/information.png')}/>
            <Text className='w-10/12 border text-sm '>By signing up, you accept our 
            <TouchableOpacity onPress={()=> setIsTermsPressed(!isTermsPressed)}><Text className='font-bold'>Terms and Conditions</Text></TouchableOpacity > and 
            <TouchableOpacity onPress={()=> setIsPrivacyPressed(!isPrivacyPressed)}><Text className='font-bold'>Privacy Policy.</Text></TouchableOpacity></Text>
        </View>
      <View className='w-11/12 absolute bottom-12'>
              <Authbutton content='Commit to my goal' onPress={()=>router.push('/congrast')}></Authbutton>
        </View>

          {isTermsPressed ? (<Modal_Terms/>): null}
           {isPrivacyPressed ? (<Modal_Privacy/>): null}
    </View>

  
  )
}

const styles = StyleSheet.create({})