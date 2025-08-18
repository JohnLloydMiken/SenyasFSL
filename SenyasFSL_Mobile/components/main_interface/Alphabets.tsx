import { View, Text , FlatList, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import Categories from '@/json_files/Categories.json'
const Alphabets = () => {
  const data = Categories[0].content?.letter
  return (
    <ScrollView style={{
      flex: 1,
      padding: 8,
      
    }}>
    
    {data?.map((item, index) =>{
      return(
        <TouchableOpacity key={index} className='w-11/12 border border-[#F7D674] rounded-full mx-auto p-2 my-3 flex-col justify-center items-center'>
          <Text className='font-PoppinsBold text-2xl md:text-3xl text-[#8B8B8B]'>
            {item}

          </Text>
          <Text className='text-[#8B8B8B] font-PoppinsRegular text-lg md:text-xl'>
            {`"${Categories[0].content?.letterFil[index]}"`}
          </Text>
        </TouchableOpacity>
      )

    })}
    </ScrollView>
  )
}

export default Alphabets