// DictionaryCategories.tsx
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { db } from '@/services/db/database'; // Import our new sync db instance

// Define a type for our Category data
interface Category {
  id: string;
  title: string;
  fil: string;
  icon: string | null;
}

// ... Your SvgSource mapping ...
const SvgSource: Record<string, any> = {
  Alphabets: require('@/assets/images/dictionary_imgs/Alphabets.png') ,
  // ... rest of your mappings
};

const DictionaryCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs when the component mounts
  useEffect(() => {
    try {
      // Use the synchronous API. It's much cleaner!
      // Use getAllSync to get all results as an array
      const results = db.getAllSync<Category>('SELECT * FROM Categories');
      setCategories(results);
    } catch (error) {
      console.error("Error fetching categories from SQLite", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // The empty array means this runs once

  if (isLoading) {
    return <Text>Loading categories...</Text>; // Show a loading state
  }
  
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
        {categories.map((item) => {
          // Use the 'icon' field from your DB (which matches 'SvgSource' in your JSON)
        
          
          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/dictionary/[contentId]",
                  params: { contentId: item.id }, // Pass the category ID
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
                backgroundColor: "white",
                elevation: 8
              }}
            >
        
              <Text style={{ marginTop: 8, textAlign: "center" }} className="font-PoppinsSemiBold text-lg md:text-xl">
                {item.title}
              </Text>
              <Text style={{ textAlign: "center" }} className="font-PoppinsLightItallic text-lg md:text-xl"> 
                "{item.fil}"
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DictionaryCategories;