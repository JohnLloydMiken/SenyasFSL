// hooks/useSignOfTheDay.ts

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DictionaryLesson } from "@/shared/types/dictionary"; // Assuming this is your RN type path

export type SignOfTheDayLesson = DictionaryLesson & { categoryLabel: string };

const CACHE_KEY = "signOfTheDay";
const TIMESTAMP_KEY = "signOfTheDay_timestamp";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Fetches the sign of the day from the cloud function.
 */
const fetchSignOfTheDay = async (): Promise<SignOfTheDayLesson | null> => {
  try {
    // Read the project ID from your Expo environment variables
    const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.warn("Firebase Project ID is not set in environment variables.");
      return null;
    }

    const url = `https://us-central1-${projectId}.cloudfunctions.net/getSignOfTheDay`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch sign of the day");
    }
    
    const data = await response.json();
    
    // Cache the new data and timestamp
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    
    return data;
  } catch (error) {
    console.error("Could not fetch Sign of the Day:", error);
    return null;
  }
};

/**
 * Hook to get the sign of the day, with 12-hour caching in AsyncStorage.
 */
export const useSignOfTheDay = () => {
  const [signOfTheDay, setSignOfTheDay] = useState<SignOfTheDayLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSign = async () => {
      try {
        // 1. Try to get data from cache
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTimestamp = await AsyncStorage.getItem(TIMESTAMP_KEY);

        if (cachedData && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const isStale = Date.now() - timestamp > CACHE_DURATION_MS;

          if (!isStale) {
            // 2. If cache is fresh, use it
            setSignOfTheDay(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }
        }

        // 3. If cache is stale or non-existent, fetch new data
        const data = await fetchSignOfTheDay();
        setSignOfTheDay(data);

      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSign();
  }, []); // Only runs once on mount

  return { signOfTheDay, isLoading, error };
};