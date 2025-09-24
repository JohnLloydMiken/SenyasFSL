import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import Categories from "@/json_files/Categories.json";
import { router, useLocalSearchParams } from "expo-router";

import LetterIcon from "@/assets/svgs/DictionarySVGs/icons8-letters-60 1.svg"
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
  Letter: LetterIcon,
  Numbers: NumbersIcon,
  Labels: LabelsIcon, 
  Calendar: CalendarIcon,
  Family: FamilyIcon,
  Occupation: OccupationIcon,
  Food: FoodIcon,
  Vocabulary: VocabularyIcon,
  Greetings: GreetingsIcon,
  Looks: LooksIcon,
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
              }}
            >
              {Icon && <Icon width={60} height={60} />}
              <Text style={{ marginTop: 8, textAlign: "center" }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DictionaryCategories;
