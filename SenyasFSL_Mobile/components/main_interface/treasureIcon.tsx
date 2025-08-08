import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Treasure from '@/assets/svgs/Treasue.svg'
import Treasure_Locked from '@/assets/svgs/Treasure_locked.svg'

type IconProp = {
  focused: boolean;
};

const TreasureIcon: React.FC<IconProp> = ({ focused }) => {

  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 24 : 50
  const path = ()=>{
      if(focused){
        return <Treasure width={svgSize} height={svgSize}/>
    }else{
        return <Treasure_Locked width={svgSize} height={svgSize}/>
    }
  }

  return path();
};

export default TreasureIcon;

const styles = StyleSheet.create({});
