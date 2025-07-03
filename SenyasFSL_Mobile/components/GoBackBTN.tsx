import { TouchableOpacity, Text, GestureResponderEvent  } from 'react-native'
import React from 'react'

type BtnProps = {
  
  onPress?: (event: GestureResponderEvent) => void;

}
const GoBackBTN: React.FC<BtnProps> = ({ onPress, }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text className='text-[#FB990F] text-lg font-PoppinsBold'>{'<Back'}</Text>
    </TouchableOpacity>
  )
}

export default GoBackBTN;