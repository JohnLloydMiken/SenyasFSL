import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity } from "react-native";
interface ButtonProps {
  text: string;
  onPress: () => void;
}

const LevelContentBtn: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={{
        width: "100%",
        borderRadius: 50,
        backgroundColor: "transparent",
        elevation: 5,
      }}
    >
      {/* Invisible text only to preserve size */}
      <TouchableOpacity onPress={onPress} className="p-4" >
        <Text className="font-PoppinsBold text-xl md:text-2xl text-center text-white">
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LevelContentBtn;