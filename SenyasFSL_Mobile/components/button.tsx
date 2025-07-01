import { TouchableOpacity, Text, GestureResponderEvent  } from 'react-native'
import React from 'react'

type BtnProps = {
  content: string;
  onPress?: (event: GestureResponderEvent) => void;

}; 
const Authbutton: React.FC<BtnProps> = ({ content, onPress, }) => {
  return (
      <TouchableOpacity
                 onPress={onPress}
      className='w-full p-4 bg-[#FB990F] rounded-md my-4'
                >
     <Text className='text-white font-bold text-center text-2xl'>{content}</Text>
    </TouchableOpacity>
  )
}

export default Authbutton;