import React from 'react';
import { StyleSheet, Image } from 'react-native';

type IconProp = {
  focused: boolean;
};

const TreasureIcon: React.FC<IconProp> = ({ focused }) => {

  const path = ()=>{
      if(focused){
        return require('../assets/images/treasure.png')
    }else{
        return require('../assets/images/Treasue.png')
    }
  }

  return (
    <Image
      source={path()}
    
    />
  );
};

export default TreasureIcon;

const styles = StyleSheet.create({});
