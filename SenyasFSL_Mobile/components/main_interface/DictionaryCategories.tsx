import { View, Text, TouchableOpacity, ScrollView, Image} from "react-native";
import React from "react";
import Categories from "@/json_files/Categories.json";
import { router, useLocalSearchParams } from "expo-router";

 
//import LetterIcon from "@/assets/images/dictionary_imgs/alphabets.png"
import  NumbersIcon from "@/assets/svgs/DictionarySVGs/icons8-numbers-64 1.svg"
import  LabelsIcon from "@/assets/svgs/DictionarySVGs/icons8-letters-60 1.svg"
import  CalendarIcon from "@/assets/svgs/DictionarySVGs/icons8-google-calendar-50 1.svg"
import  FamilyIcon from "@/assets/svgs/DictionarySVGs/icons8-family-50 1.svg"
import  OccupationIcon from "@/assets/svgs/DictionarySVGs/icons8-occupation-64 1.svg"
import  FoodIcon from "@/assets/svgs/DictionarySVGs/icons8-pizza-80 1.svg"
import  VocabularyIcon from "@/assets/svgs/DictionarySVGs/icons8-vocabulary-64 1.svg"
import  GreetingsIcon from "@/assets/svgs/DictionarySVGs/icons8-greetings-50 1.svg"
import  LooksIcon from "@/assets/svgs/DictionarySVGs/icons8-try-and-buy-50 1.svg"




// Central SVG mapping
const SvgSource: Record<string, any> = {
  Alphabets: require('@/assets/images/dictionary_imgs/Alphabets.png') ,
  Colors: require('@/assets/images/dictionary_imgs/Colors.png') , 
  Family: require('@/assets/images/dictionary_imgs/Family.png') ,
  Months: require('@/assets/images/dictionary_imgs/Month.png') ,
  Numbers: require('@/assets/images/dictionary_imgs/Numbers.png') ,
  Occupation: require('@/assets/images/dictionary_imgs/Occupation.png') ,
  Ordinal: require('@/assets/images/dictionary_imgs/Ordinals.png') ,
  Places: require('@/assets/images/dictionary_imgs/Places.png') ,
  Relationships: require('@/assets/images/dictionary_imgs/Relationship.png') ,
  Time: require('@/assets/images/dictionary_imgs/Time.png') ,
  Weather: require('@/assets/images/dictionary_imgs/Weather.png') ,
};

const DictionaryCategories = () => {
  const { contentId } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: 16,
          height: "100%",
        }}
      >
        {Categories.map((item) => {
          // Pick SVG based on the "SvgSource" key in JSON
          const Icon = SvgSource[item.SvgSource];

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/dictionary/[contentId]",
                  params: { contentId: item.id.toString() },
                })
              }
              key={item.id}
              style={{
                borderWidth: 1,
                borderColor: "#F7D674",
                borderRadius: 16,
                width: "48%",
                height: 150,
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                backgroundColor: "white",
                 elevation: 8
              }}
            >
              {Icon && <Image source={Icon} style={{width: 30, height: 30}} />}
              <Text style={{ marginTop: 8, textAlign: "center" }} className="font-PoppinsSemiBold text-lg md:text-xl">
                {item.title}
               
              </Text>
               <Text style={{ textAlign: "center" }} className="font-PoppinsLightItallic text-lg md:text-xl"> 
               
                "{item.fil}"
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DictionaryCategories;
