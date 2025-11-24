import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
interface LearnAsignBTNProps {
  EnglishText: string;
  FilipinoText: string;
}

const LearnAsignBTN: React.FC<LearnAsignBTNProps> = ({
  EnglishText,
  FilipinoText,
}) => {
  return (
    <TouchableOpacity className="w-full p-2 border border-[#F7D674] rounded-full my-3" disabled>
      <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
        {EnglishText}
      </Text>
      <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] ">
        {FilipinoText}
      </Text>
    </TouchableOpacity>
  );
};
export default LearnAsignBTN;
