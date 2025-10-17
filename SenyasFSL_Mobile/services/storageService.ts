import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig"; // Make sure you export this from your config

/**
 * Converts a gs:// storage path to a public https:// download URL.
 */
export const getDownloadURLFromGSPath = async (gsPath: string): Promise<string> => {
  if (!gsPath || !gsPath.startsWith("gs://")) {
    console.warn("Invalid GS path provided:", gsPath);
    return ""; // Return empty or a placeholder URL
  }
  
  try {
    const storageRef = ref(storage, gsPath);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return ""; // Handle error gracefully
  }
};