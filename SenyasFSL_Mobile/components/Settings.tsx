import { View, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Setting from '@/assets/svgs/Settings.svg'
import React from "react";
import Slider from '@react-native-community/slider'
interface SettingsProps {
    toggled: boolean
}

const Settings: React.FC<SettingsProps> = ({toggled }) =>{
        const [isPressed, setIsPressed] = useState(toggled)
        const {width} = useWindowDimensions()
        const svgSize = width < 768 ? 44 : 55
    return (
        <>
            {isPressed ? (
                <TouchableOpacity>
                        <Setting width={svgSize} height={svgSize}/>
                        <Slider/>
                </TouchableOpacity>
            ) : null}
        </>
    )
}

export default Settings
