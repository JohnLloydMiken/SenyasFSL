import { TouchableOpacity, Image, GestureResponderEvent  } from 'react-native'
import React from 'react'

type BtnProps = {
  
  onPress?: (event: GestureResponderEvent) => void;

}
const GoBackBTN: React.FC<BtnProps> = ({ onPress, }) => {
  return (
    <TouchableOpacity onPress={onPress} className='= mb-4 mr-4'>
        <Image source={require('@/assets/images/headerBackBTN.png')} className=''/>
    </TouchableOpacity>
  )
}

export default GoBackBTN;