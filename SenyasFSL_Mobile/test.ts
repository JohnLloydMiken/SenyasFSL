import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Save test data
export const testWrite = async () => {
  await setDoc(doc(db, "testCollection", "testDoc"), {
    message: "Hello Firestore 🚀",
    createdAt: new Date()
  });
  console.log("Test data written!");
};

// Read test data
export const testRead = async () => {
  const docRef = doc(db, "testCollection", "testDoc");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    console.log("Firestore says:", snapshot.data());
  }
};
