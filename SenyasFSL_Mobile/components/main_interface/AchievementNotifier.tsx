// components/AchievementNotifier.tsx
// This component listens to the achievement store and displays a modal
// when a new achievement is in the queue.

import React, { useState, useEffect } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAchievementStore } from "@/hooks/useAchievementStore";
import { ContentAchievement } from "@/shared/types/achievements";

export const AchievementNotifier: React.FC = () => {
  const { newlyUnlocked, getNextAchievement } = useAchievementStore();
  const [visible, setVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<ContentAchievement | null>(null);

  useEffect(() => {
    // If the modal is not visible and there are achievements in the queue
    if (!visible && newlyUnlocked.length > 0) {
      const next = getNextAchievement(); // Pull the next one
      if (next) {
        setCurrentAchievement(next); // Set it as current
        setVisible(true); // Show the modal
      }
    }
  }, [newlyUnlocked, visible, getNextAchievement]);

  const handleClose = () => {
    setVisible(false);
    setCurrentAchievement(null);
    // The modal is closed, and the useEffect will automatically check
    // for the next achievement in the queue on its next run.
  };

  if (!currentAchievement) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>Achievement Unlocked!</Text>
          
          {/* We use a fallback image, but you'd use currentAchievement.image */}
          <Image 
            source={{ uri: currentAchievement.image || 'https://via.placeholder.com/100' }} 
            style={styles.achievementImage} 
          />
          
          <Text style={styles.achievementTitle}>{currentAchievement.title}</Text>
          <Text style={styles.achievementDescription}>{currentAchievement.description}</Text>
          
          <Text style={styles.rewardText}>
            You earned {currentAchievement.rewardCoins} Senyas Coins!
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={handleClose}
          >
            <Text style={styles.textStyle}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Add some basic styling
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)", // Dim background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  achievementImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#eee' // Placeholder bg
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
   achievementDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4CAF50", // A nice green for reward
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },
});