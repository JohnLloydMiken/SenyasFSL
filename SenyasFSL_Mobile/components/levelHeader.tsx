import { StyleSheet, Text, ImageBackground, View, Image } from 'react-native'
import React from 'react'



type levelHeaderProps = {
    title : string,
    level: number,
    section: number
}

const levelHeader: React.FC<levelHeaderProps>=({title, section, level})=> {
  return (
            <View className='w-11/12 h-20  mt-4 flex flex-row justify-between items-center'>
                <ImageBackground 
            style={styles.container}
            source={require('../assets/images/Section1.png')}
            imageStyle ={{borderRadius: 10, width: '100%' }}
            >
                  
            </ImageBackground> 
                   <View className='p-4'>
                     <Text className='text-white text-sm font-PoppinsRegular'>Section {section}, Level {level}</Text>
                   <Text className='text-white text-lg font-PoppinsBold'>{title}</Text>
                  </View>
                  <View className='p-4'>
                    <Image source={require('../assets/images/book.png')}/>
                  </View>
            </View>  
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