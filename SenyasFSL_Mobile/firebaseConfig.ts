import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmyKS8jAc2sVxBJUVz9tizepMxSVCD_nQ",
  authDomain: "senyasfsl-bd43e.firebaseapp.com",
  projectId: "senyasfsl-bd43e",
  storageBucket: "senyasfsl-bd43e.firebasestorage.app",
  messagingSenderId: "572916746691",
  appId: "1:572916746691:web:1e11d8f2d3ce33aacfd576",
  measurementId: "G-V0W3ZJBJ0E"
};

// Ensure Firebase is not re-initialized on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Use persistence with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };