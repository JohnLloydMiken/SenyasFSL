import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
interface userInputProps {
    title: string,
    usernameTitle: string,
    userEmailTitle: string,
    userPasswordTitle: string
    passwordTitleDescription: string
}

const UserInput: React.FC<userInputProps> = ({title, usernameTitle, userEmailTitle, userPasswordTitle, passwordTitleDescription}) =>{

        const [isToggled, setIsToggled] = useState(false)
    return(
       <>
             <View className='w-11/12'>
            <Text className='text-2xl font-bold text-center'>{title}</Text>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                {usernameTitle}
            </Text>
            <TextInput placeholder='Username' className='border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4'/>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                {userEmailTitle}
            </Text>
            <TextInput placeholder='Email' className='border-[#D5DDE5] border-[1px] rounded-lg bg-white p-4'/>
        </View>
        <View className='w-11/12'>
            <Text className='text-lg font-bold'>
                {userPasswordTitle}
            </Text>
            <Text className='text-sm'>{passwordTitleDescription}</Text>

           <View className=' flex flex-row items-center border-[#D5DDE5] border-[1px] bg-white rounded-lg p-2 justify-between'>
            <TextInput placeholder='Password' secureTextEntry ={!isToggled}/>
            <TouchableOpacity onPress={()=> setIsToggled(!isToggled)}>
                 <Ionicons name={isToggled ? 'eye' : 'eye-off'} size={20} color={'#919191'} />
            </TouchableOpacity>
           </View>
        </View>
       </>
    )
}

export default UserInput