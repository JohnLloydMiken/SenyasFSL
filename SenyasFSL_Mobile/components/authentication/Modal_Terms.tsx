import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import TermsAndCondition from "@/json_files/TermsAndCondition.json";
export default function Modal_Terms() {
  const [isVisible, setIsVisible] = useState(true);
  const { width } = useWindowDimensions();
  const iconSize = width < 769 ? 30 : 50;
  return (
    <Modal animationType="fade" visible={isVisible}>
      <View className="bg-[#FAF3E0] flex-1 p-4 gap-4">
        <View className="flex-row w-full  justify-between items-center border-b-2 border-b-amber-900">
          <Text className="text-center text-2xl md:text-3xl font-PoppinsBold">
            SenyasFSL Terms and Conditions
          </Text>
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <Ionicons
              name="close"
              size={iconSize}
              color={"#FB990F"}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        </View>
        <View className="w-full">
          <Text className="text-lg md:text-xl font-PoppinsSemiBold text-gray-500">
            Effective Date: December 25, 2025
          </Text>
          <Text className="font-PoppinsBold text-xl md:text-2xl text-center mt-4">
            Welcome to SenyasFSL! These Terms and Conditions ("Terms") govern
            your use of our mobile application and services. By using SenyasFSL,
            you agree to these Terms.
          </Text>
        </View>
        <FlatList
          data={TermsAndCondition}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View className="w-11/12 p-4 bg-white mx-auto my-3 rounded-2xl">
                <Text className="font-PoppinsBold text-xl md:text-2xl mb-2">
                  {item.termTitle}
                </Text>

                {item.termSpecifics.map((point, idx) => (
                  <View key={idx} className="flex-row mb-1">
                    <Text className="text-lg md:text-xl font-PoppinsRegular">
                      •{" "}
                    </Text>
                    <Text className="flex-1 text-lg md:text-xl font-PoppinsRegular">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
