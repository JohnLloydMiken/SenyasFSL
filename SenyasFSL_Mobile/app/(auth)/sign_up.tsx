import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import Authbutton from '@/components/button'
import React from 'react'
import { router } from 'expo-router'
import { useState } from 'react'
import UserInput from '@/components/userInput'
import Modal_Terms from '@/components/Modal_Terms'
import Modal_Privacy from '@/components/Modal_Privacy'
export default function sign_up() {


    const [isTermsPressed, setIsTermsPressed] = useState(false)
    const [isPrivacyPressed, setIsPrivacyPressed] = useState(false)

  return (

    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8'>
       
       <UserInput  
       title='Sign up for free and start learning!'
       usernameTitle='Username'
       userEmailTitle='Email'
       userPasswordTitle='Password'
       passwordTitleDescription='At least 6 characters'
       />

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