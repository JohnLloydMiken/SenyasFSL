import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FSL_Reminder from "@/assets/svgs/FSL_Reminder.svg";
import { fslIconSize } from "@/utils/sizes";

interface ReminderNotifProps{
    onRemind: ()=>void,
    onContinue: ()=> void
}

const ReminderNotif: React.FC<ReminderNotifProps> = ({onRemind, onContinue}) => {
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <FSL_Reminder width={275} height={275} />
      <Text className="font-PoppinsBold text-2xl md:text-3xl text-center w-11/12">
        Never forget to lose a streak again!
      </Text>
      <Text className="font-PoppinsLightItallic text-sm text-center md:text-lg w-11/12">
        We’ll remind you about completing your streak every day.
      </Text>
      <View className="w-11/12 gap-2 absolute bottom-8">
        <TouchableOpacity
          className="w-full bg-[#FB990F] p-4 rounded-lg"
          onPress={onRemind}
        >
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
            Remind me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full border-4 p-4 rounded-lg border-[#FB990F]"
          onPress={onContinue}
        >
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#FB990F]">
            No thanks
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReminderNotif;
