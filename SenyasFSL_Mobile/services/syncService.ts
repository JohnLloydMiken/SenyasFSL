// services/syncService.ts
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { db } from "@/services/db/database"; // Import our new sync db instance
import {
  db as firestoreDB,
  storage as firebaseStorage,
} from "@/firebaseConfig"; // Import your Firebase config

// Define types for our data
interface DictionaryEntry {
  id: string;
  categoryId: string;
  enLabel: string;
  filLabel: string;
  remoteVideoUrl: string;
  localVideoUri: string | null;
}

// Helper function to ensure our video directory exists
const videoDir = FileSystem.documentDirectory + "videos/";
const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(videoDir);
  if (!dirInfo.exists) {
    console.log("Video directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(videoDir, { intermediates: true });
  }
};

/**
 * Converts a gs:// path to a downloadable HTTPS URL using the v9 SDK.
 */
const getDownloadUrl = async (gsPath: string) => {
  try {
    const storageRef = ref(firebaseStorage, gsPath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error getting download URL for ${gsPath}:`, error);
    return null;
  }
};

/**
 * The main sync function.
 */
export const syncData = async () => {
  console.log("Starting data sync...");
  await ensureDirExists();

  try {
    const categoriesCollection = collection(
      firestoreDB,
      "dictionaryCategories"
    );
    const categoriesSnapshot = await getDocs(categoriesCollection);

    for (const categoryDoc of categoriesSnapshot.docs) {
      const category = categoryDoc.data();
      const categoryId = categoryDoc.id;

      const title = category.label || categoryId;
      const fil = category.subtext || categoryId;

      // 1. Add/Update Category in local DB
      db.runSync(
        "INSERT OR REPLACE INTO Categories (id, title, fil, icon) VALUES (?, ?, ?, ?)",
        [categoryId, title, fil, category.icon]
      );

      // 2. Loop through all video items
      const items = category.items || [];
      for (const item of items) {
        
        // --- NEW BULLETPROOF FIX ---
        // Use enLabel as a fallback if id is missing
        const entryId = item.id || item.enLabel;

        // If both are missing, we must skip this item
        if (!entryId) {
          console.warn("Skipping item with missing 'id' and 'enLabel'");
          continue;
        }
        // --- END FIX ---

        // 3. Check if this item is already in our local DB
        const existingEntry = db.getFirstSync<DictionaryEntry>(
          "SELECT * FROM DictionaryEntries WHERE id = ?",
          entryId // Use our new safe ID
        );

        // 4. If it's not downloaded
        if (!existingEntry || !existingEntry.localVideoUri) {
          console.log(`Downloading video for ${item.enLabel}...`);

          const downloadUrl = await getDownloadUrl(item.video);
          if (!downloadUrl) {
            console.warn(`No valid video URL for ${item.enLabel}`);
            continue; 
          }

          // Use our new safe ID for the filename
          const localUri = videoDir + `${entryId}.mp4`;

          // 6. Download the file
          const downloadResult = await FileSystem.downloadAsync(
            downloadUrl,
            localUri
          );
          console.log(`Downloaded ${item.enLabel} to ${downloadResult.uri}`);

          // 7. Save to DB with our new safe ID
          db.runSync(
            "INSERT OR REPLACE INTO DictionaryEntries (id, categoryId, enLabel, filLabel, remoteVideoUrl, localVideoUri) VALUES (?, ?, ?, ?, ?, ?)",
            [
              entryId, // Use our new safe ID
              categoryId,
              item.enLabel,
              item.filLabel,
              item.video,
              downloadResult.uri,
            ]
          );
          console.log(`Saved ${item.enLabel} to local DB.`);
        } else {
          // console.log(`Skipping ${item.enLabel}, already downloaded.`);
        }
      }
    }
    console.log("Data sync complete.");
  } catch (error) {
    console.error("CRITICAL SYNC ERROR:", error);
  }
};