import { View, Text , TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import Categories from '@/json_files/Categories.json'
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  onPress: (letter: string, letterFil: string, letterSource: string) => void;
}

const Alphabets: React.FC<Props> = ({ onPress }) => {
  const data = Categories[0].content?.eng;
  const dataFil = Categories[0].content?.fil;
  const dataSource = Categories[0].content?.source
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView style={{ flex: 1 }}>
      {data?.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="w-11/12 border border-[#F7D674] rounded-full mx-auto p-2 my-3 flex-col justify-center items-center"
          onPress={() => onPress(item, dataFil?.[index] || "" , dataSource?.[index] || "")}
        >
          <Text className="font-PoppinsBold text-2xl md:text-3xl text-[#8B8B8B]">
            {item}
          </Text>
          <Text className="text-[#8B8B8B] font-PoppinsRegular text-lg md:text-xl">
            {`"${dataFil?.[index]}"`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

export default Alphabets