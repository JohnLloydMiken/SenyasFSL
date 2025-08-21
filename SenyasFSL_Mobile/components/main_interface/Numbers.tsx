import { View, Text , TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import Categories from '@/json_files/Categories.json'

interface Props {
  onPress: (number: string, numberFil: string, numberSource: string) => void;
}

const Numbers: React.FC<Props> = ({ onPress }) => {
  const data = Categories[1].content?.number;
  const dataNum = Categories[1].content?.numberFil;
  const dataSource = Categories[1].content?.numberVidSource
  return (
    <ScrollView style={{ flex: 1, padding: 8 }}>
      {data?.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="w-11/12 border border-[#F7D674] rounded-full mx-auto p-2 my-3 flex-col justify-center items-center"
          onPress={() => onPress(item, dataNum?.[index] || "" , dataSource?.[index] || "")}
        >
          <Text className="font-PoppinsBold text-2xl md:text-3xl text-[#8B8B8B]">
            {item}
          </Text>
          <Text className="text-[#8B8B8B] font-PoppinsRegular text-lg md:text-xl">
            {`"${dataNum?.[index]}"`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Numbers