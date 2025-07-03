import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

type IconProp = {
  focused: boolean;
};

const HomeIcon: React.FC<IconProp> = ({ focused }) => {

  const path = ()=>{
      if(focused){
        return require('../assets/images/home.png')
    }else{
        return require('../assets/images/homeGrey.png')
    }
  }

  return (
    <Image
      source={path()}
      style={{
        width: 20,
        height: 20,
       
      }}
    />
  );
};

export default HomeIcon;

const styles = StyleSheet.create({});
