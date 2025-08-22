import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useCallback, useMemo, JSX } from "react";
import Facts from "@/json_files/facts.json";
import Awards from "@/json_files/awards.json";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Awards_lock from "@/assets/svgs/awards_lock.svg";
import Fact_locked from "@/assets/svgs/fact_lock.svg";
import PFD from "@/assets/svgs/PFD.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

// Type definitions
interface Fact {
  id: number;
  Fact_title: string;
  image: string;
  unlocked: boolean;
  content?: string;
  funFact?: string;
}

interface Award {
  id: number;
  award_title: string;
  AwardImage: string;
  unlocked?: boolean;
  description?: string;
  requirements?: string;
  dateEarned?: string;
}

type ItemType = 'award' | 'fact';
type SelectedItem = Award | Fact | null;

interface SvgComponent {
  width: number;
  height: number;
}

type SvgMap = {
  [key: string]: React.FC<SvgComponent>;
};

export default function Index(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Achievement />
    </GestureHandlerRootView>
  );
}

function Achievement(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [itemType, setItemType] = useState<ItemType | null>(null);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const { width } = useWindowDimensions();

  // Type the imported JSON data
  const factsData = Facts as Fact[];
  const awardsData = Awards as Award[];

  // Memoized values
  const svgSize: number = useMemo(() => (width < 768 ? 100 : 120), [width]);
  const unlockedFacts: number = useMemo(() => 
    factsData.filter((f: Fact) => f.unlocked).length, 
    [factsData]
  );
  const snapPoints: string[] = useMemo(() => ['60%'], []);

  const svgMap: SvgMap = useMemo(() => ({
    "awards_lock.svg": Awards_lock,
    "fact_lock.svg": Fact_locked,
    "PFD.svg": PFD,
  }), []);

  // Type guards
  const isAward = (item: SelectedItem): item is Award => {
    return item !== null && 'award_title' in item;
  };

  const isFact = (item: SelectedItem): item is Fact => {
    return item !== null && 'Fact_title' in item;
  };

  // Handlers
  const handleItemPress = useCallback((item: Award | Fact, type: ItemType): void => {
    setSelectedItem(item);
    setItemType(type);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChanges = useCallback((index: number): void => {
    if (index === -1) {
      setSelectedItem(null);
      setItemType(null);
    }
  }, []);

  const renderGradientText = useCallback((text: string): JSX.Element => (
    <MaskedView
      maskElement={
        <Text className="text-2xl md:text-3xl font-PoppinsBold">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={["#FB990F", "#EA0505"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text
          style={{ opacity: 0 }}
          className="text-2xl md:text-3xl font-PoppinsBold"
        >
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  ), []);

  const renderAwardItem = useCallback((item: Award, index: number): JSX.Element => {
    const SvgIcon: React.FC<SvgComponent> | undefined = svgMap[item.AwardImage];
    
    return (
      <TouchableOpacity
        key={`award-${index}`}
        className="w-1/3 mb-4 flex flex-col items-center"
        onPress={() => handleItemPress(item, 'award')}
        accessible={true}
        accessibilityLabel={`Award: ${item.award_title}`}
        accessibilityHint="Tap to view award details"
      >
        {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
        <Text className="text-center mt-2 text-sm font-medium" numberOfLines={2}>
          {item.award_title}
        </Text>
      </TouchableOpacity>
    );
  }, [svgMap, svgSize, handleItemPress]);

  const renderFactItem = useCallback((item: Fact, index: number): JSX.Element => {
    const SvgIcon: React.FC<SvgComponent> | undefined = item.unlocked ? PFD : svgMap[item.image];
    
    return (
      <TouchableOpacity
        key={`fact-${index}`}
        className="w-1/3 mb-4 flex flex-col items-center"
        onPress={() => handleItemPress(item, 'fact')}
        accessible={true}
        accessibilityLabel={`Fact: ${item.Fact_title}`}
        accessibilityHint={item.unlocked ? "Tap to read fact" : "Fact is locked"}
      >
        {SvgIcon && <SvgIcon width={svgSize} height={svgSize} />}
        <Text className="text-center mt-2 text-sm font-medium" numberOfLines={2}>
          {item.Fact_title}
        </Text>
      </TouchableOpacity>
    );
  }, [svgMap, svgSize, handleItemPress]);

  const renderAwardContent = useCallback((award: Award): JSX.Element => (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">{award.award_title}</Text>
      <Text className="text-base mb-4 leading-6">
        {award.description || 'This is an achievement award!'}
      </Text>
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="font-semibold">Requirements:</Text>
        <Text className="mt-2">
          {award.requirements || 'Complete specific tasks to unlock this award.'}
        </Text>
      </View>
      {award.unlocked && (
        <View className="bg-green-100 p-4 rounded-lg mt-4">
          <Text className="text-green-800 font-semibold">🎉 Congratulations! Award Unlocked!</Text>
          <Text className="text-green-700 mt-1">
            Earned on: {award.dateEarned || 'Today'}
          </Text>
        </View>
      )}
    </View>
  ), []);

  const renderFactContent = useCallback((fact: Fact): JSX.Element => (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">{fact.Fact_title}</Text>
      {fact.unlocked ? (
        <>
          <Text className="text-base mb-4 leading-6">
            {fact.content || 'The Personal Flotation Device (PFD) is a critical safety equipment that helps keep you afloat in water. It\'s designed to provide buoyancy and increase your chances of survival in aquatic emergencies.'}
          </Text>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="font-semibold text-blue-800">Did you know?</Text>
            <Text className="text-blue-700 mt-2">
              {fact.funFact || 'PFDs can support up to 22 pounds of buoyancy and are required by law on most watercraft!'}
            </Text>
          </View>
        </>
      ) : (
        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-600 text-center">🔒 This fact is locked</Text>
          <Text className="text-gray-500 text-center mt-2">
            Complete more activities to unlock this interesting fact!
          </Text>
        </View>
      )}
    </View>
  ), []);

  const renderBottomSheetContent = useCallback((): JSX.Element | null => {
    if (!selectedItem) return null;

    if (itemType === 'award' && isAward(selectedItem)) {
      return renderAwardContent(selectedItem);
    }

    if (itemType === 'fact' && isFact(selectedItem)) {
      return renderFactContent(selectedItem);
    }

    return null;
  }, [selectedItem, itemType, renderAwardContent, renderFactContent, isAward, isFact]);

  const unlockedAwardsCount: number = useMemo(() => 
    awardsData.filter((award: Award) => award.unlocked).length, 
    [awardsData]
  );

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        {/* Awards Section */}
        <View>
          <View className="ml-4 mt-4">
            {renderGradientText(`Awards (${unlockedAwardsCount})`)}
          </View>
          <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4">
            {awardsData.map(renderAwardItem)}
          </View>
        </View>

        {/* Facts Section */}
        <View className="mt-6">
          <View className="ml-4 mt-4">
            {renderGradientText(`Facts (${unlockedFacts})`)}
          </View>
          <View className="w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4 pb-6">
            {factsData.map(renderFactItem)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: '#ccc' }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderBottomSheetContent()}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({});