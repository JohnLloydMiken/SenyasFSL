// components/ReportBottomSheetContent.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { submitReport } from "@/services/reportService"; // Use your service
import { SubmitReportData } from "@/shared/types/report"; // Reuse shared types

// Copied from your web version
const reportTypes = [
  { value: "wrong_sign", label: "Wrong Sign/Translation" },
  { value: "bug", label: "Technical Bug/Glitch" },
  { value: "suggestion", label: "Suggestion/Feedback" },
  { value: "other", label: "Other" },
];

interface ReportBottomSheetContentProps {
  // Pass these in from your game screen
  levelId: string;
  currentStep: number;
  // Function to close the sheet from the parent
  onClose: () => void;
}

const ReportBottomSheetContent: React.FC<ReportBottomSheetContentProps> = ({
  levelId,
  currentStep,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please provide a description.");
      return;
    }

    setIsSubmitting(true);
    const reportData: SubmitReportData = {
      reportType: selectedType.value,
      description,
      levelId: levelId, // Pass this from your game state
      currentStep: currentStep, // Pass this from your game state
    };

    try {
      await submitReport(reportData);
      // Clear form and close sheet on success
      setDescription("");
      setSelectedType(reportTypes[0]);
      onClose();
    } catch (error) {
      // Error is already handled by the toast in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.categoryButton,
              selectedType.value === type.value && styles.selectedCategory,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedType.value === type.value && styles.selectedCategoryText,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Please describe the issue..."
        style={styles.textInput}
        multiline
        textAlignVertical="top" // for Android
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add your own styles to match your app's theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FAF3E0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#F7D674",
  },
  selectedCategory: {
    backgroundColor: "#FB990F",
    borderColor: "#FB990F",
  },
  categoryText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  textInput: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: "#F7D674",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    width: "100%",
    padding: 18,
    backgroundColor: "#FB990F",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#F7B25A",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    padding: 18,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#AAA",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#777",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReportBottomSheetContent;