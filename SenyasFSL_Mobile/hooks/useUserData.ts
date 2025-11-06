import type { User as AuthUser } from "firebase/auth";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserProfileData } from "shared/types/user"; // 👈 1. IMPORT THE TYPE
import { db } from "../firebaseConfig";
import { useAuth } from "../services/auth/AuthProvider";

// 2. The local UserProfileData interface has been REMOVED from this file.

const parseUserData = (data: any, authUser: AuthUser): UserProfileData => {
  const defaults = {
    username: "New User",
    currentStreak: 0,
    streakFreezes: 0,
    xp: 0,
    senyasCoins: 0,
    activityDays: [],
    progress: {},
    inventory: { xpMultiply: 0, bomb: 0, skip: 0, twotry: 0, streakProtect: 0 },
    chestCount: 0,
    achievements: [],
    lastUpdated: Timestamp.now(),
  };

  return {
    ...defaults,
    ...data,
    uid: authUser.uid,
    email: authUser.email || "",
  };
};

export function useUserData() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, "users", authUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const parsedData = parseUserData(docSnap.data(), authUser);
        setUserData(parsedData);
      } else {
        console.error("User document not found!");
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authUser]);

  return { userData, loading };
}