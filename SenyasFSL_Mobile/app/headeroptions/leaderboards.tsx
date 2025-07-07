import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import Leaderboards from '@/json_files/leaderboards.json'
export default function leaderboards() {

const [selected, setSelected] = useState<'daily' | 'weekly' | 'monthly'>('daily');

const topThree= Leaderboards.slice(0,3)
const rest = Leaderboards.slice(3);

  return (
      <LinearGradient
      colors={['#2DE2E2', '#0922A0']} // blue shades top to bottom
                                style={{ flex: 1, position: 'relative' }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
      >

      <View className='w-11/12 p-4 flex flex-row justify-between items-center bg-[#672F00] rounded-xl mx-auto my-4'>
        <TouchableOpacity onPress={()=> setSelected('daily')}>
          <Text className= {` ${ selected === 'daily' ? 'underline underline-offset-8 text-2xl font-PoppinsBold text-white' : 'text-2xl font-PoppinsBold text-white'}`}>Daily</Text>
        </TouchableOpacity>

          <TouchableOpacity onPress={()=> setSelected('weekly')}>
          <Text className= {` ${selected === 'weekly' ? 'underline underline-offset-8 text-2xl font-PoppinsBold text-white' : 'text-2xl font-PoppinsBold text-white'}`}>Weekly</Text>
        </TouchableOpacity>

          <TouchableOpacity  onPress={()=> setSelected('monthly')}>
          <Text className= {` ${selected === 'monthly' ? 'underline underline-offset-8 text-2xl font-PoppinsBold text-white' : 'text-2xl font-PoppinsBold text-white'}`}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <View className='w-11/12 mx-auto my-4 p-4 border'>
        <View className='w-11/12 flex flex-row justify-center items-end mx-auto my-0  border border-green-500'>
          <View className='bg-[#FB990F] h-28 w-1/3'></View>
           <View className='bg-[#FBAB0F] h-32 w-1/3'></View>
            <View className='bg-[#FB790F] h-24 w-1/3'></View>
        </View>
        <View className='bg-white p-8 w-full rounded-xl'>
          <FlatList
          data={rest}
          keyExtractor={(item, index)=> index.toString()}
          renderItem={({item, index}) =>(
            <View className='w-full flex flex-row justify-between items-center'> 
              <Text>{item.rank}</Text>
               <Text>{item.name}</Text>
                <Text>{item.score}</Text>
            </View>
          )}
          />
        </View>
      </View>

      </LinearGradient>
  )
}

const styles = StyleSheet.create({})