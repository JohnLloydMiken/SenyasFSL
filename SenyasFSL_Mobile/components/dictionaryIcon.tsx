import React from 'react';
import { StyleSheet, Image } from 'react-native';

type IconProp = {
  focused: boolean;
};

const DictionaryIcon: React.FC<IconProp> = ({ focused }) => {

  const path = ()=>{
      if(focused){
        return require('../assets/images/dictionary.png')
    }else{
        return require('../assets/images/DictionaryGrey.png')
    }
  }

  return (
    <Image
      source={path()}
     
    />
  );
};

export default DictionaryIcon;

const styles = StyleSheet.create({});
