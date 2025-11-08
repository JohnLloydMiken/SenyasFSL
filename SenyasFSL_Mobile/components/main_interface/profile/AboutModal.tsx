import { View, Text } from 'react-native'
import React from 'react'
import AboutIcon from '@/components/Icons/AboutIcon'
import Authbutton from '@/components/authentication/button'

interface AboutModalProps{
    onPress: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({onPress}) => {
  return (
    <View
                style={{
                  padding: 20,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FAF3E0",
                  gap: 16,
                }}
              >
                <AboutIcon width={50} height={50} />
                <Text className="text-3xl font-PoppinsBold md:text-4xl">
                  About SenyasFSL
                </Text>
                <Text className="font-PoppinsRegular text-xl text-center">
                  <Text className="font-bold">SenyasFSL</Text> is a gamified
                  Filipino Sign Language (FSL) learning application. Our mission
                  is to make learning FSL fun, accessible, and engaging for
                  everyone.
                </Text>
                <Text className="font-PoppinsRegular text-xl text-center">
                  The platform blends language education with interactive games,
                  gesture recognition, and progress tracking to create an
                  inclusive and enjoyable experience for all learners.
                </Text>
                {/* Add your Imprint component or content here */}
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

export default AboutModal