// services/reportService.ts
import { httpsCallable, HttpsCallableResult } from "firebase/functions"; // 👈 From Web SDK
import { functions } from "@/firebaseConfig"; // 👈 From your config
import Toast from "react-native-toast-message"; // 👈 From React Native
import {
  SubmitReportData,
  SubmitReportResult,
  GetReportsData,
  GetReportsResult,
  UpdateReportStatusData,
  UpdateReportStatusResult,
  DeleteReportData,
  DeleteReportResult,
} from "shared/types/report"; // Make sure this path is correct

/**
 * Calls the secure backend function to submit a user report.
 * This is the mobile-native version.
 */
export const submitReport = async (
  data: SubmitReportData
): Promise<SubmitReportResult> => {
  // 1. Show a loading toast
  Toast.show({
    type: "info",
    text1: "Submitting report...",
    visibilityTime: 2000,
  });

  try {
    // 2. Get the callable function (using your project's correct syntax)
    const submitReportFunction = httpsCallable<
      SubmitReportData,
      SubmitReportResult
    >(functions, "submitReport");

    // 3. Call the function
    const result = await submitReportFunction(data);

    // 4. Show success toast
    Toast.show({
      type: "success",
      text1: "Report submitted! Thank you.",
    });

    return result.data;
  } catch (error) {
    console.error("Error submitting report:", error);

    // 5. Show error toast
    Toast.show({
      type: "error",
      text1: "Could not submit report.",
      text2: "Please try again later.",
    });
    throw new Error("Failed to submit report.");
  }
};

// --- Other Admin Functions (Converted) ---

export const updateReportStatus = async (
  reportId: string,
  newStatus: "new" | "pending" | "resolved"
): Promise<UpdateReportStatusResult> => {
  try {
    const updateFunction = httpsCallable<
      UpdateReportStatusData,
      UpdateReportStatusResult
    >(functions, "updateReportStatus");
    const result = await updateFunction({ reportId, newStatus });
    return result.data;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
};

export const deleteReport = async (
  reportId: string
): Promise<DeleteReportResult> => {
  try {
    const deleteFunction = httpsCallable<DeleteReportData, DeleteReportResult>(
      functions,
      "deleteReport"
    );
    const result = await deleteFunction({ reportId });
    return result.data;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

export const getReports = async (): Promise<GetReportsResult> => {
  try {
    const getReportsFunction = httpsCallable<GetReportsData, GetReportsResult>(
      functions,
      "getReportsAsAdmin"
    );
    const result = await getReportsFunction({});
    return result.data;
  } catch (error) {
    console.error("Error getting reports:", error);
    throw error;
  }
};