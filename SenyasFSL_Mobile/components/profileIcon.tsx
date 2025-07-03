import React from 'react';
import { StyleSheet, Image } from 'react-native';

type IconProp = {
  focused: boolean;
};

const ProfileIcon: React.FC<IconProp> = ({ focused }) => {

  const path = ()=>{
      if(focused){
        return require('../assets/images/profile.png')
    }else{
        return require('../assets/images/ProfileGray.png')
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

export default ProfileIcon;

const styles = StyleSheet.create({});
