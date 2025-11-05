// app/(main_interface)/treasure.tsx
import Tutorial from "@/assets/svgs/Tutorial.svg";
import BGComponent from "@/assets/svgs/bg 1.svg";
import Item from "@/components/main_interface/treasure/items";
import Item_function from "@/json_files/item_function.json";
import { useAuthStore } from "@/utils/store/useAuthStore";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image, // ✅ Import ActivityIndicator
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LootModal from "@/components/main_interface/treasure/LootModal";
import { buyItem, openChest } from "@/services/gameService";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import LottieView from "lottie-react-native";
import chestAnimation from "../../assets/lottie/chest.json";

// ✅ 1. IMPORT TANSTACK QUERY HOOKS
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// ✅ 2. IMPORT YOUR USER PROFILE FETCHER
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

  // ✅ 3. GET THE QUERY CLIENT
  const queryClient = useQueryClient();

  // ✅ 4. FETCH USER DATA WITH useQuery
  // This replaces useUserStore()
  const {
    data: userData,
    isLoading: userLoading, // This is true ONLY on initial load
    isFetching: isUserFetching, // This is true on background refreshes
  } = useQuery({
    queryKey: ["user", user?.uid], // Unique key for this data
    queryFn: () => fetchUserProfile(user!.uid), // The function that fetches
    enabled: !!user, // Only run if the user is logged in
  });

  // ✅ 5. CREATE MUTATION FOR BUYING AN ITEM
  // This replaces isPurchasing state and handleBuyItem logic
  const buyItemMutation = useMutation({
    mutationFn: (variables: { itemId: string; itemCost: number }) =>
      buyItem(variables.itemId, variables.itemCost), //
    onSuccess: (success) => {
      if (success) {
        Toast.show({
          type: "success",
          text1: "Purchase Successful!",
          text2: "The item has been added to your inventory.",
        });
        // ✅ KEY: Invalidate the user query to refetch data
        queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not complete purchase.",
      });
    },
  });

  // ✅ 6. CREATE MUTATION FOR OPENING A CHEST
  // This replaces isOpeningChest state and handleOpenChest logic
  const openChestMutation = useMutation({
    mutationFn: (prizeId: string) => openChest(prizeId), //
    onSuccess: (data, prizeId) => {
      // Find the prize object to show in the modal
      const prize = prizePool.find((p) => p.id === prizeId);
      setWonPrize(prize || prizePool[0]); // Show the modal
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "An Error Occurred",
        text2: error.message || "Could not open chest.",
      });
      animationRef.current?.reset(); // Reset animation on fail
    },
  });

  // ✅ 7. THIS IS THE NEW LOADING CHECK
  // It only shows "Loading..." on the *initial* load, not on re-fetches.
  if (authLoading || userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasChest = (userData?.chestCount ?? 0) > 0;

  // ✅ 8. SIMPLIFIED handleBuyItem
  const handleBuyItem = (itemId: string, itemCost: number) => {
    // Check if any mutation is already running
    if (buyItemMutation.isPending || openChestMutation.isPending || !user) return;

    if ((userData?.senyasCoins ?? 0) < itemCost) {
      Toast.show({
        type: "error",
        text1: "Not Enough Coins",
        text2: "You don't have enough coins to buy this item.",
      });
      return;
    }
    // Just call mutate!
    buyItemMutation.mutate({ itemId, itemCost });
  };

  // ✅ 9. SIMPLIFIED handleOpenChest
  const handleOpenChest = () => {
    if (openChestMutation.isPending || buyItemMutation.isPending || !user) return;

    animationRef.current?.play(); // Play the animation

    // Wait for animation
    setTimeout(() => {
      const prize = prizePool[Math.floor(Math.random() * prizePool.length)];
      // Just call mutate!
      openChestMutation.mutate(prize.id);
    }, 3000); // 3 seconds for your animation
  };

  // ✅ 10. CRITICAL: handleCloseLootModal now invalidates data
  const handleCloseLootModal = () => {
    setWonPrize(null);
    animationRef.current?.reset();
    // NOW we refetch the user data, after the modal is closed
    // This will happen silently in the background.
    queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
  };

  const handleMainButtonPress = () => {
    if (hasChest) {
      handleOpenChest();
    } else {
      router.push("./index");
    }
  };

  // Check if *any* action is happening
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

      {/* ✅ OPTIONAL: Show a subtle loading spinner during background fetch */}
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
              You have {userData?.chestCount}. Open it to receive random item
            </Text>
            <View className="w-full h-36 md:h-72">
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

        {/* ✅ 11. Main button disabled state updated */}
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
        {/* ✅ 12. All items disabled state updated */}
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