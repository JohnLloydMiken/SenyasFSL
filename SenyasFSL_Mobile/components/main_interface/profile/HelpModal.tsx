import { View, Text, Image } from 'react-native'
import React from 'react'
import Authbutton from '@/components/authentication/button'

interface HelpModalProps{
    onPress: () => void;
}


const HelpModal: React.FC<HelpModalProps> = ({onPress}) => {
  return (
    <View className="p-4 flex-1 justify-center items-center gap-4  bg-[#FAF3E0]">
              <Image
                source={require("@/assets/images/HelpUSer.png")}
                width={150}
                height={150}
              />
              <Text className="text-center text-4xl font-PoppinsBold md:text-4xl">
                Help & Support
              </Text>
              <Text className="font-PoppinsRegular text-2xl text-center md:text-3xl">
                If you’re stuck or have any suggestions, please reach out to our
                support team at{" "}
                <Text className="text-blue-600 underline">
                  s3nyasfsl@gmail.com.
                </Text>
              </Text>
              {/* Add your Help component or content here */}
              <View
                style={{ width: "100%", marginTop: "auto", paddingBottom: 20 }}
              >
                <Authbutton
                  content="Close"
                  onPress={onPress}
                />
              </View>
            </View>
  )
}

export default HelpModal