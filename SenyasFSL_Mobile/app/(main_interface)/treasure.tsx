import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import Item from "@/components/items";
import Item_function from "@/json_files/item_function.json";
import Tutorial from "@/assets/svgs/Tutorial.svg";
import BG from '@/assets/svgs/bg 1.svg'
export default function treasure() {
  const videoSource = require("@/assets/videos/Treasure.mp4");
  const [haveChest, setHaveChest] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 44 : 60;
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.play();
  });

  return (
    <View className="bg-white flex-1 items-center relative">
             <View className='w-full h-full absolute top-0 left-0 '><BG width={'100%'} height={'100%'} scaleX={1.2} scaleY={1.2} /></View>
      <View className="w-11/12 h-max mx-auto my-0 flex justify-center items-center flex-col mb-4">
        <Text className="font-PoppinsBold text-xl md:text-2xl mt-2 text-center">
          You have no chests right now, get 7 questions right in a row to open
          1!
        </Text>
        {haveChest ? (
          <View className="w-full h-52 md:h-96">
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          </View>
        ) : (
          <Image
            source={require("../../assets/images/Treasure_Locked.png")}
            className="w-44 h-36 mr-3"
          />
        )}
        <TouchableOpacity className="w-2/3 p-4 bg-[#27D700] rounded-xl mt-4">
          <Text className="font-PoppinsBold text-white text-xl md:text-2xl text-center">
            {haveChest ? "Claim Chest" : "Start a lesson"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-11/12  flex-col justify-center items-center md:mt-8">
        {/* Item row 1*/}
        <View className="flex-row justify-center md:justify-between  gap-24 mb-4 w-2/3 ">
          <Item itemName="XP Multiply" itemCost={350} itemIcon="Potion" />
          <Item itemName="Bomb" itemCost={20} itemIcon="Bomb" />
        </View>
        {/* Item row 2*/}
        <View className="flex-row justify-center md:justify-between w-2/3 gap-24 mb-4">
          <Item itemName="Skip" itemCost={50} itemIcon="Next" />
          <Item itemName="2x Try" itemCost={25} itemIcon="Retry" />
        </View>
        {/* Item row 3*/}
        <View className="flex-row justify-center gap-4 mb-4">
          <Item
            itemName="Streak Protection"
            itemCost={500}
            itemIcon="Protection"
          />
        </View>
      </View>
      {/* Tutorial Button */}
      <TouchableOpacity
        className="absolute bottom-4 left-4"
        onPress={() => setIsShown(!isShown)}
      >
        <Tutorial width={svgSize} height={svgSize} />
      </TouchableOpacity>

      {isShown && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-40" />
      )}

      {isShown ? (
        <View className=" bg-[#FAF3E0] absolute  top-1/2  -translate-y-1/2 w-2/3 p-4 z-50 rounded-2xl">
          <View className="flex flex-row justify-between items-center border-b-2 border-b-[#F2C484]">
            <Text className="font-PoppinsBold text-xl md:text-3xl">
              Items Function
            </Text>
            <TouchableOpacity
              className="bg-[#B2AFAB] w-8 h-8 md:w-10 md:h-10 rounded-full flex justify-center items-center mb-2"
              onPress={() => setIsShown(false)}
            >
              <Text className="font-PoppinsBold text-white text-sm md:text-lg">
                X
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={Item_function}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text className="text-justify my-2">
                🔹
                <Text className="font-PoppinsSemiBold text-xl md:text-2xl">
                  {item.item_name}
                </Text>{" "}
                -{" "}
                <Text className="font-PoppinsRegular text-lg md:text-xl">
                  {item.item_description}
                </Text>
              </Text>
            )}
          />
          <TouchableOpacity
            className="w-1/3 md:w-1/2 p-3 border border-black mx-auto mt-2 rounded-lg"
            onPress={() => setIsShown(!isShown)}
          >
            <Text className="font-PoppinsRegular text-center text-lg md:text-2xl">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
