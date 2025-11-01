// hooks/usePlayableUrl.ts

import { useState, useEffect } from "react";
// This function should exist in your project to get a Firebase Storage URL
import { getVideoUrl } from "@/services/gameService"; 

export const usePlayableUrl = (videoPath: string | undefined) => {
  const [playableUrl, setPlayableUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!videoPath) {
      setPlayableUrl(undefined);
      return;
    }

    let isMounted = true;
    const fetchUrl = async () => {
      try {
        // We assume getVideoUrl exists in your storageService
        const url = await getVideoUrl(videoPath);
        if (isMounted) {
          setPlayableUrl(url);
        }
      } catch (error) {
        console.error("Failed to get playable video URL:", error);
        if (isMounted) {
          setPlayableUrl(undefined); // Set to undefined on error
        }
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [videoPath]);

  return playableUrl;
};