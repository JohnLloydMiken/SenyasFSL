// app/(main_interface)/treasure.tsx
// --- MODIFIED FILE ---
import { TreasurePreview } from "@/components/main_interface/treasure/items";
import Tutorial from "@/assets/svgs/Tutorial.svg";
import BGComponent from "@/assets/svgs/bg 1.svg";
import Item from "@/components/main_interface/treasure/items";
import Item_function from "@/json_files/item_function.json";
import { useAuthStore } from "@/utils/store/useAuthStore";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ MODIFICATION: Make sure this path is correct
// Your previous file had this, but the user-uploaded
// LootModal.tsx file has a different path.
// I am keeping your original, working path.
import LootModal from "@/components/main_interface/treasure/LootModal";

import { buyItem, openChest } from "@/services/gameService";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import LottieView from "lottie-react-native";
import chestAnimation from "../../assets/lottie/chest.json";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService"; //

const BG = React.memo(BGComponent);

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

interface Prize {
  id: string;
  name: string;
}

export default function Treasure() {
  const [isShown, setIsShown] = useState(false);
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const animationRef = useRef<LottieView>(null);

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: userLoading,
    isFetching: isUserFetching,
  } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: () => fetchUserProfile(user!.uid),
    enabled: !!user,
  });

  const buyItemMutation = useMutation({
    mutationFn: (variables: { itemId: string; itemCost: number }) =>
      buyItem(variables.itemId, variables.itemCost),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Purchase Successful!",
        text2: "The item has been added to your inventory.",
      });
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not complete purchase.",
      });
    },
  });

  // ✅ --- MODIFICATION ---
  // The mutation logic is now simplified.
  // It only handles the network call and data invalidation.
  // The logic to show the modal (setWonPrize) is moved to `handleOpenChest`.
  const openChestMutation = useMutation({
    mutationFn: (prizeId: string) => openChest(prizeId),
    onSuccess: () => {
      // SUCCESS! Invalidate the query *immediately*.
      // This updates the coins/inventory in the background
      // *while* the animation is still playing.
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    },
    // We will handle the error in the `handleOpenChest` function's
    // try/catch block, so `onError` here is not strictly needed
    // unless you want a fallback.
  });

  if (authLoading || userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasChest = (userData?.chestCount ?? 0) > 0;

  const handleBuyItem = (itemId: string, itemCost: number) => {
    if (buyItemMutation.isPending || openChestMutation.isPending || !user) return;

    if ((userData?.senyasCoins ?? 0) < itemCost) {
      Toast.show({
        type: "error",
        text1: "Not Enough Coins",
        text2: "You don't have enough coins to buy this item.",
      });
      return;
    }
    buyItemMutation.mutate({ itemId, itemCost });
  };

  // ✅ --- MODIFICATION ---
  // This function is now async and uses Promise.all
  const handleOpenChest = async () => {
    if (openChestMutation.isPending || buyItemMutation.isPending || !user) return;

    // 1. Determine the prize *immediately*
    const prize = prizePool[Math.floor(Math.random() * prizePool.length)];

    // 2. Start the animation *immediately*
    animationRef.current?.play();

    // 3. Create a promise that resolves after the animation duration (3000ms)
    const animationPromise = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // 4. Wait for BOTH the network request AND the animation to finish
      await Promise.all([
        openChestMutation.mutateAsync(prize.id), // The network request
        animationPromise, // The 3-second timer
      ]);

      // 5. Once BOTH are done, show the modal.
      setWonPrize(prize);
    } catch (error: any) {
      // 6. If anything fails (network request), show an error
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not open chest.",
      });
      animationRef.current?.reset(); // Reset animation on fail
    }
  };

  const handleCloseLootModal = () => {
    setWonPrize(null);
    animationRef.current?.reset();
    // No need to invalidate queries here, it was already done
    // in openChestMutation.onSuccess
  };

  const handleMainButtonPress = () => {
    if (hasChest) {
      handleOpenChest();
    } else {
      router.push("/(main_interface)");
    }
  };

  const isBusy =
    buyItemMutation.isPending ||
    openChestMutation.isPending ||
    isUserFetching;

  return (
    <View className="bg-white flex-1 items-center relative">
      {/* Background */}
      <View className="w-full h-full absolute top-0 left-0">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>

      {isUserFetching && !userLoading && (
        <View className="absolute top-4 right-4 z-50">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}

      {/* Chest + Button */}
      <View className="w-11/12 flex justify-center items-center flex-col mb-4">
        {hasChest ? (
          <>
            <Text className="font-PoppinsBold text-xl md:text-2xl mt-2 text-center">
              You have {userData?.chestCount} right now. Get 8 questions in a
              row to open 1!
            </Text>
            <View className="w-full h-44 md:h-72 ">
              <LottieView
                ref={animationRef}
                source={chestAnimation} //
                loop={false}
                autoPlay={false}
                style={{ width: "100%", height: "100%" }}
              />
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
              style={{ resizeMode: "contain" }}
            />
          </>
        )}

        <TouchableOpacity
          className="w-2/3 p-4 bg-[#27D700] rounded-xl mt-4"
          onPress={handleMainButtonPress}
          disabled={isBusy}
        >
          <Text className="font-PoppinsBold text-white text-xl md:text-2xl text-center">
            {hasChest ? "Claim Rewards" : "Start a lesson"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <View className="w-11/12 flex-col justify-center items-center md:mt-8 ">
        <View className="flex-row justify-center gap-24 mb-4 w-2/3">
          <Item
            itemName="XP Multiply"
            itemCost={350}
            itemIcon="Potion"
            itemId="xpMultiply"
            onPress={handleBuyItem}
            disabled={isBusy}
          />
          <Item
            itemName="Bomb"
            itemCost={20}
            itemIcon="Bomb"
            itemId="bomb"
            onPress={handleBuyItem}
            disabled={isBusy}
          />
        </View>

        <View className="flex-row justify-center w-2/3 gap-24 mb-4">
          <Item
            itemName="Skip"
            itemCost={50}
            itemIcon="Next"
            itemId="skip"
            onPress={handleBuyItem}
            disabled={isBusy}
          />
          <Item
            itemName="2x Try"
            itemCost={25}
            itemIcon="Retry"
            itemId="twotry"
            onPress={handleBuyItem}
            disabled={isBusy}
          />
        </View>
        <View className="flex-row justify-center gap-4 mb-4">
          <Item
            itemName="Streak Protection"
            itemCost={500}
            itemIcon="Protection"
            itemId="streakProtect"
            onPress={handleBuyItem}
            disabled={isBusy}
          />
        </View>
      </View>

      {/* Tutorial Button */}
      
     
      <TouchableOpacity
        className="absolute bottom-4 left-4"
        onPress={() => setIsShown(true)}
        disabled={isBusy}
      >
        <Tutorial width={44} height={44} />
      </TouchableOpacity>

      {/* Tutorial Modal */}
      {isShown && <TutorialModal onClose={() => setIsShown(false)} />}

      {/* Render the new LootModal conditionally */}
      <LootModal prize={wonPrize} onClose={handleCloseLootModal} />
    </View>
  );
}