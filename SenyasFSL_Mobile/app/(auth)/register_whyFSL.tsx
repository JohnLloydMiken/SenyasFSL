import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import Authbutton from '@/components/button';
import whyFSL_choices from '@/whylearnFSL.json'
import { useState } from 'react';
import { router } from 'expo-router';


const imageMap: { [key: string]: any } = {
  "Family.png": require("../../assets/images/Family.png"),
  "Work.png": require("../../assets/images/Work.png"),
  "Friends.png": require("../../assets/images/Friends.png"),
  "deaf.png": require("../../assets/images/deaf.png"),
  "Others.png": require("../../assets/images/Others.png"),
  "Fun.png": require("../../assets/images/Fun.png"),
};

export default function register_whyFSL() {

  
    const [selectedItemIndex , setSelectedItemIndex ] = useState<number | null>(null)

  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-4'>
      <Text className='text-2xl font-bold mt-4'>Why would you like to learn FSL?</Text>
     <View className='w-11/12 h-max '>
        <FlatList
        data={whyFSL_choices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity className={`w-full flex justify-start items-center gap-4 border-[1px] border-[#F7D674] ${selectedItemIndex === index ? "bg-[#FFEEB9] " : "bg-white"} flex-row rounded-3xl px-4 py-2 my-4`}
         onPress={() => setSelectedItemIndex(selectedItemIndex === index ? null : index)}
         
          >
            <Image
              source={imageMap[item.image]}
              className="w-10 h-10 rounded"
              resizeMode="contain"
            />
          
              <Text className="text-lg font-semibold mt-2 text-[#8B8B8B]">{item.reason}</Text>
          
          </TouchableOpacity>
        )}
        
        style ={{width: '100%'}}
      /></View>
       <View className='w-11/12 absolute bottom-12'>
         <Authbutton content='Next' onPress={()=> router.push('/register_how') }/>
       </View>
    </View>
  )
}

const styles = StyleSheet.create({})