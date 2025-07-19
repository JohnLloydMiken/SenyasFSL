import { StyleSheet, Text,  View, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import Book from '@/assets/svgs/A-Z.svg'


type levelHeaderProps = {
    title : string,
    level: number,
    section: number
}

const levelHeader: React.FC<levelHeaderProps>=({title, section, level})=> {
  const {width} = useWindowDimensions();
  const svgSize = width <768 ? 30 : 50;
   const height = width <768 ? '9%' : '25%';
  return (
            <LinearGradient
                 colors={["#41BABA", "#3E58D9"]} // orange to red
                 start={{ x: 0, y: -0.1 }}
                 end={{ x: 0, y: 0.8 }}
                 style={{
                   borderRadius: 12,
                   padding: 8, // This controls the thickness of the border
                   width: '90%',
                   height: height,
                   marginTop: 16,
                   backgroundColor: "white",
                   elevation: 8,
                 }}>
                  
                 <View className='w-full flex-row justify-between items-center  h-full'>
                      <View >
                     <Text className='text-white text-lg md:text-xl font-PoppinsMedium'>Section {section}, Level {level}</Text>
                   <Text className='text-white text-xl md:text-2xl font-PoppinsBold'>{title}</Text>
                  </View>
                  <View >
                    <Book width={svgSize} height={svgSize}/>
                  </View>
                 </View>
                  
                   </LinearGradient>
  )
}

const styles = StyleSheet.create({

 container:{
    width : '100%',
    height: '100%',
    position: 'absolute'
 }
  
})

export default  levelHeader

/*
 <View className='p-4'>
                     <Text className='text-white text-sm font-PoppinsRegular'>Section {section}, Level {level}</Text>
                   <Text className='text-white text-lg font-PoppinsBold'>{title}</Text>
                  </View>
                  <View className='p-4'>
                    <Image source={require('../assets/images/book.png')}/>
                  </View>

*/