import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Categories from '@/json_files/Categories.json'
import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

const DictionaryCategories = () => {

  const {contentId} = useLocalSearchParams()
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' , }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 16,
          height: '100%',
         
        }}
      >
        {Categories.map((item) => {
          return (
            <TouchableOpacity
            onPress={()=> router.push({
              pathname: '/dictionary/[contentId]',
              params: {contentId : item.id.toString()}
            })}
              key={item.id}
              style={{
                borderWidth: 1,
                borderColor: '#F7D674',
                borderRadius: 16,
                width: '48%',
                height: 150, // half of row (with small gap)
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 12,
              }}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default DictionaryCategories
