import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Dictionary from '@/assets/svgs/Dictionary.svg'
import Dictionary_locked from '@/assets/svgs/Dictionary_locked.svg'
type IconProp = {
  focused: boolean;
};

const DictionaryIcon: React.FC<IconProp> = ({ focused }) => {

  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 24 : 50
  const path = ()=>{
      if(focused){
        return <Dictionary width={svgSize} height={svgSize}/>
    }else{
        return <Dictionary_locked width={svgSize} height={svgSize}/>
    }
  }

  return path();
};

export default DictionaryIcon;

const styles = StyleSheet.create({});
