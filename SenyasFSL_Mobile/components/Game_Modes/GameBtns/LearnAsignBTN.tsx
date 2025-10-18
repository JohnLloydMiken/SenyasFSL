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
  clicked: boolean;
  onPress: () => void;
}

const LearnAsignBTN: React.FC<LearnAsignBTNProps> = ({
  EnglishText,
  FilipinoText,
  onPress,
  clicked,
}) => {
  return (
    <>
      {clicked === true ? (
        <LinearGradient
          colors={["#FB990F", "#EA0505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={{
            width: "100%",
            borderRadius: 50,
            backgroundColor: "transparent",
            elevation: 5,
            padding: 1,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {/* Invisible text only to preserve size */}
          <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-full w-full p-2"
          >
            {/* English Text */}
            <MaskedView
              maskElement={
                <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
                  {EnglishText}
                </Text>
              }
            >
              <LinearGradient
                colors={["#FB990F", "#EA0505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
              >
                {/* Invisible text only to preserve size */}
                <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center opacity-0">
                  {EnglishText}
                </Text>
              </LinearGradient>
            </MaskedView>

            {/* Filipino Text */}
            <MaskedView
              maskElement={
                <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] ">
                  {FilipinoText}
                </Text>
              }
            >
              <LinearGradient
                colors={["#FB990F", "#EA0505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
              >
                {/* Invisible text only to preserve size */}
                <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] opacity-0">
                  {FilipinoText}
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          className="w-full p-2 border border-[#F7D674] rounded-full my-3"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
            {EnglishText}
          </Text>
          <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B] ">
            {FilipinoText}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
export default LearnAsignBTN;
