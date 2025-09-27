import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import {  Text, View, TouchableOpacity  } from "react-native";

interface MCBTNProps {
  EnglishText: string;
  FilipinoText: string;
  onPress: () => void;
  clicked: boolean; // Keep for backward compatibility
  isCorrect: boolean;
  isSelected: boolean; // New: is this specific button selected
  hasChecked: boolean; // New: has the check button been pressed
  rounded: number;
}

const MCBTN: React.FC<MCBTNProps> = ({
  EnglishText,
  FilipinoText,
  onPress,
  clicked,
  isCorrect,
  isSelected, 
  hasChecked,
  rounded
}) => {
 
  if (!isSelected && !hasChecked) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`w-full p-2 border bg-white border-[#F7D674] ${rounded === 6 ? 'rounded-md' : 'rounded-full'}  my-3 z-50`}  
      >
        <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
          {EnglishText}
        </Text>
      {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
          {FilipinoText}
        </Text>}
      </TouchableOpacity>
    );
  }

  // State 2: Selected but not checked yet (orange gradient with MaskedView)
  if (isSelected && !hasChecked) {
    return (
      <LinearGradient
        colors={["#FB990F", "#EA0505"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 2,
          marginTop: 10,
          marginBottom: 10,
          zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className={`bg-white ${rounded === 6 ? 'rounded-md' : 'rounded-full'} w-full p-2`}
        >
          {/* English Text with MaskedView */}
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

          {/* Filipino Text with MaskedView */}
         {FilipinoText === "" ?  null :(
             <MaskedView
            maskElement={
              <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
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
         )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // State 3a: Checked and correct (green gradient)
  if (hasChecked && isCorrect) {
    return (
      <LinearGradient
        colors={["#31F705", "#007D00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 1,
          marginTop: 10,
          marginBottom: 10,
           zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className=" rounded-full w-full p-2"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-white text-center">
            {EnglishText}
          </Text>
         {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-white">
          {FilipinoText}
        </Text>}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // State 3b: Checked and incorrect (red gradient)
  if (hasChecked && !isCorrect) {
    return (
      <LinearGradient
        colors={["#FF6A6C", "#A20000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{
          width: "100%",
          borderRadius: rounded,
          backgroundColor: "transparent",
          elevation: 5,
          padding: 1,
          marginTop: 10,
          marginBottom: 10,
           zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className=" rounded-full w-full p-2"
        >
          <Text className="text-xl md:text-2xl font-PoppinsBold text-white text-center">
            {EnglishText}
          </Text>
          {FilipinoText === "" ? null :   <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-white">
          {FilipinoText}
        </Text>}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // Default fallback (shouldn't reach here)
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full p-2 border border-[#F7D674] rounded-full my-3"
    >
      <Text className="text-xl md:text-2xl font-PoppinsBold text-[#8B8B8B] text-center">
        {EnglishText}
      </Text>
      <Text className="text-center font-PoppinsLightItallic text-lg md:text-xl text-[#8B8B8B]">
        {FilipinoText}
      </Text>
    </TouchableOpacity>
  );
};


export default MCBTN;