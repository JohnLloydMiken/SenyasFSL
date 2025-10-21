// app/(main_interface)/treasure.tsx
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import Item from "@/components/main_interface/items";
import Item_function from "@/json_files/item_function.json";
import Tutorial from "@/assets/svgs/Tutorial.svg";
import BGComponent from "@/assets/svgs/bg 1.svg";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";

// ✅ 1. Import the new toast and service
import Toast from "react-native-toast-message";
import { buyItem } from "@/services/gameService";

// ... (BG, TreasureVideo, TutorialModal components remain the same) ...
const BG = React.memo(BGComponent);

const TreasureVideo = React.memo(({ source }: { source: any }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  return (
    <VideoView
      style={{ width: "100%", height: "100%" }}
      player={player}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      nativeControls={false}
    />
  );
});

const TutorialModal = React.memo(({ onClose }: { onClose: () => void }) => (
  <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-40 justify-center items-center">
    <View className="bg-[#FAF3E0] w-2/3 p-4 rounded-2xl z-50">
      <View className="flex flex-row justify-between items-center border-b-2 border-b-[#F2C484]">
        <Text className="font-PoppinsBold text-xl md:text-3xl">
          Items Function
        </Text>
        <TouchableOpacity
          className="bg-[#B2AFAB] w-8 h-8 md:w-10 md:h-10 rounded-full justify-center items-center mb-2"
          onPress={onClose}
        >
          <Text className="font-PoppinsBold text-white text-sm md:text-lg">
            X
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {Item_function.map((item, index) => (
          <Text key={index} className="text-justify my-2">
            🔹
            <Text className="font-PoppinsSemiBold text-xl md:text-2xl">
              {item.item_name}
            </Text>{" "}
            -{" "}
            <Text className="font-PoppinsRegular text-lg md:text-xl">
              {item.item_description}
            </Text>
          </Text>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="w-1/3 md:w-1/2 p-3 border border-black mx-auto mt-2 rounded-lg"
        onPress={onClose}
      >
        <Text className="font-PoppinsRegular text-center text-lg md:text-2xl">
          OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
));

export default function Treasure() {
  const videoSource = require("@/assets/videos/Treasure.mp4");
  const [isShown, setIsShown] = useState(false);
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading, fetchUserData } = useUserStore(); // ✅ Get fetchUserData

  // ✅ 2. Add loading state for purchases
  const [isPurchasing, setIsPurchasing] = useState(false);

  // ... (loading state check)
  if (authLoading || userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasChest = (userData?.chestCount ?? 0) > 0;

  // ✅ 3. Create the handler function to buy an item
  const handleBuyItem = async (itemId: string, itemCost: number) => {
    if (isPurchasing || !user) return; // Prevent double-clicks or if user is somehow null

    // Client-side check for coins
    if ((userData?.senyasCoins ?? 0) < itemCost) {
      Toast.show({
        type: "error",
        text1: "Not Enough Coins",
        text2: "You don't have enough coins to buy this item.",
      });
      return;
    }

    setIsPurchasing(true); // Set loading state
    try {
      const success = await buyItem(itemId, itemCost);

      if (success) {
        // Show success message
        Toast.show({
          type: "success",
          text1: "Purchase Successful!",
          text2: "The item has been added to your inventory.",
        });

        // IMPORTANT: Re-fetch user data to update coin balance
        await fetchUserData(user);
      }
      // If `success` is false, the `buyItem` service already showed an error toast
    } catch (error: any) {
      // Fallback for unexpected errors
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not complete purchase.",
      });
    } finally {
      setIsPurchasing(false); // Clear loading state
    }
  };

  return (
    <View className="bg-white flex-1 items-center relative">
      {/* Background */}
      <View className="w-full h-full absolute top-0 left-0">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>

      {/* ... (Chest + Button section remains the same) ... */}
      <View className="w-11/12 flex justify-center items-center flex-col mb-4">
        {hasChest ? (
         <>
          <Text className="font-PoppinsBold text-xl md:text-2xl mt-2 text-center">
              You have {userData?.chestCount}. Open it to receive random item
            </Text>
          <View className="w-full h-36 md:h-72">
            <TreasureVideo source={videoSource} />
          </View>
         </>
        ) : (
          <>
            <Text className="font-PoppinsBold text-xl md:text-2xl mt-2 text-center">
              You have no chests right now, get 7 questions right in a row to
              open 1!
            </Text>
            <Image
              source={require("../../assets/images/Treasure_Locked.png")}
              className="w-44 h-36 mr-3"
            />
          </>
        )}

        <TouchableOpacity className="w-2/3 p-4 bg-[#27D700] rounded-xl mt-4">
          <Text className="font-PoppinsBold text-white text-xl md:text-2xl text-center">
            {hasChest ? "Claim Chest" : "Start a lesson"}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Items */}
      {/* ✅ 4. Pass the new props to each Item */}
      <View className="w-11/12 flex-col justify-center items-center md:mt-8">
        <View className="flex-row justify-center gap-24 mb-4 w-2/3">
          <Item
            itemName="XP Multiply"
            itemCost={350}
            itemIcon="Potion"
            itemId="xpMultiply" // Use a unique ID
            onPress={handleBuyItem}
            disabled={isPurchasing}
          />
          <Item
            itemName="Bomb"
            itemCost={20}
            itemIcon="Bomb"
            itemId="bomb"
            onPress={handleBuyItem}
            disabled={isPurchasing}
          />
        </View>
        <View className="flex-row justify-center w-2/3 gap-24 mb-4">
          <Item
            itemName="Skip"
            itemCost={50}
            itemIcon="Next"
            itemId="skip"
            onPress={handleBuyItem}
            disabled={isPurchasing}
          />
          <Item
            itemName="2x Try"
            itemCost={25}
            itemIcon="Retry"
            itemId="twotry"
            onPress={handleBuyItem}
            disabled={isPurchasing}
          />
        </View>
        <View className="flex-row justify-center gap-4 mb-4">
          <Item
            itemName="Streak Protection"
            itemCost={500}
            itemIcon="Protection"
            itemId="streakProtect"
            onPress={handleBuyItem}
            disabled={isPurchasing}
          />
        </View>
      </View>

      {/* Tutorial Button */}
      <TouchableOpacity
        className="absolute bottom-4 left-4"
        onPress={() => setIsShown(true)}
      >
        <Tutorial width={44} height={44} />
      </TouchableOpacity>

      {/* Tutorial Modal */}
      {isShown && <TutorialModal onClose={() => setIsShown(false)} />}
    </View>
  );
}

