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
import Item from "@/components/main_interface/treasure/items";
import Item_function from "@/json_files/item_function.json";
import Tutorial from "@/assets/svgs/Tutorial.svg";
import BGComponent from "@/assets/svgs/bg 1.svg";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";

import Toast from "react-native-toast-message";
import { buyItem, openChest } from "@/services/gameService";
import { useRouter } from "expo-router";
// ✅ 1. Import your new LootModal
import LootModal from "@/components/main_interface/treasure/LootModal";

const BG = React.memo(BGComponent);

// ✅ ADDED THIS COMPONENT FROM YOUR ORIGINAL FILE
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
  // ... (Modal content remains the same) ...
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

const prizePool = [
  { id: "xpMultiply", name: "XP Multiply" },
  { id: "bomb", name: "Bomb" },
  { id: "skip", name: "Skip" },
  { id: "twotry", name: "2x Try" },
  { id: "streakProtect", name: "Streak Protection" },
];

// Define the prize type
interface Prize {
  id: string;
  name: string;
}

export default function Treasure() {
  const videoSource = require("@/assets/videos/Treasure.mp4");
  const [isShown, setIsShown] = useState(false);
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading, fetchUserData } = useUserStore();
  const router = useRouter();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpeningChest, setIsOpeningChest] = useState(false);

  // ✅ 2. Add state to hold the won prize
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  if (authLoading || userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasChest = (userData?.chestCount ?? 0) > 0;

  const handleBuyItem = async (itemId: string, itemCost: number) => {
    if (isPurchasing || isOpeningChest || !user) return; // Prevent action if busy

    if ((userData?.senyasCoins ?? 0) < itemCost) {
      Toast.show({
        type: "error",
        text1: "Not Enough Coins",
        text2: "You don't have enough coins to buy this item.",
      });
      return;
    }

    // ✅ THIS IS THE LOGIC THAT WAS MISSING
    setIsPurchasing(true);
    try {
      // The buyItem service shows its own "Purchasing..." and "Error" toasts
      const success = await buyItem(itemId, itemCost);

      if (success) {
        // We just need to show the success toast
        Toast.show({
          type: "success",
          text1: "Purchase Successful!",
          text2: "The item has been added to your inventory.",
        });
        await fetchUserData(user);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not complete purchase.",
      });
    } finally {
      setIsPurchasing(false);
    }
  }; // ✅ ADDED THE CLOSING BRACE HERE

  // ✅ 3. Update the chest handler (Now outside handleBuyItem)
  const handleOpenChest = async () => {
    if (isOpeningChest || isPurchasing || !user) return;

    setIsOpeningChest(true);
    try {
      const prize = prizePool[Math.floor(Math.random() * prizePool.length)];
      await openChest(prize.id);

      // ✅ 5. SET the prize in state to show the modal
      setWonPrize(prize);

      // Re-fetch user data
      
    } catch (error: any) {
      // Error toast is fine
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not open chest.",
      });
    } finally {
      setIsOpeningChest(false); // Clear loading state
    }
  };

  // ✅ 6. Add a handler to close the modal (Now outside handleBuyItem)
  const handleCloseLootModal = async () => {
  setWonPrize(null);
  if (user) await fetchUserData(user);
};

  // ✅ (Now outside handleBuyItem)
  const handleMainButtonPress = () => {
    if (hasChest) {
      handleOpenChest();
    } else {
      router.push("./index");
    }
  };

  return (
    <View className="bg-white flex-1 items-center relative">
      {/* Background */}
      <View className="w-full h-full absolute top-0 left-0">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>

      {/* Chest + Button */}
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
        
        {/* ✅ Main Button (Moved this up to match your new layout) */}
        <TouchableOpacity
          className="w-2/3 p-4 bg-[#27D700] rounded-xl mt-4"
          onPress={handleMainButtonPress}
          disabled={isOpeningChest || isPurchasing} // Disable when opening or purchasing
        >
          <Text className="font-PoppinsBold text-white text-xl md:text-2xl text-center">
            {hasChest ? "Claim Chest" : "Start a lesson"}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Items */}
      {/* ✅ Pass the combined disabled state to each Item */}
      <View className="w-11/12 flex-col justify-center items-center md:mt-8">
        <View className="flex-row justify-center gap-24 mb-4 w-2/3">
          <Item
            itemName="XP Multiply"
            itemCost={350}
            itemIcon="Potion"
            itemId="xpMultiply" // This ID must match the prizePool
            onPress={handleBuyItem}
            disabled={isPurchasing || isOpeningChest} // Disable here
          />
          <Item
            itemName="Bomb"
            itemCost={20}
            itemIcon="Bomb"
            itemId="bomb" // This ID must match the prizePool
            onPress={handleBuyItem}
            disabled={isPurchasing || isOpeningChest} // Disable here
          />
        </View>
        <View className="flex-row justify-center w-2/3 gap-24 mb-4">
          <Item
            itemName="Skip"
            itemCost={50}
            itemIcon="Next"
            itemId="skip" // This ID must match the prizePool
            onPress={handleBuyItem}
            disabled={isPurchasing || isOpeningChest} // Disable here
          />
          <Item
            itemName="2x Try"
            itemCost={25}
            itemIcon="Retry"
            itemId="twotry" // This ID must match the prizePool
            onPress={handleBuyItem}
            disabled={isPurchasing || isOpeningChest} // Disable here
          />
        </View>
        <View className="flex-row justify-center gap-4 mb-4">
          <Item
            itemName="Streak Protection"
            itemCost={500}
            itemIcon="Protection"
            itemId="streakProtect" // This ID must match the prizePool
            onPress={handleBuyItem}
            disabled={isPurchasing || isOpeningChest} // Disable here
          />
        </View>
      </View>

      {/* Tutorial Button */}
      <TouchableOpacity
        className="absolute bottom-4 left-4"
        onPress={() => setIsShown(true)}
        disabled={isOpeningChest || isPurchasing}
      >
        <Tutorial width={44} height={44} />
      </TouchableOpacity>

      {/* Tutorial Modal */}
      {isShown && <TutorialModal onClose={() => setIsShown(false)} />}

      {/* ✅ 7. Render the new LootModal conditionally */}
      <LootModal prize={wonPrize} onClose={handleCloseLootModal} />
    </View>
  );
}