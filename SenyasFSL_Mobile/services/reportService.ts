// src/services/reportService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import {
  SubmitReportData,
  SubmitReportResult,
  GetReportsData,
  GetReportsResult,
  UpdateReportStatusData,
  UpdateReportStatusResult,
  DeleteReportData,
  DeleteReportResult,
} from "shared/types/report";
import toast from "react-hot-toast";

/**
 * Calls the secure backend function to submit a user report.
 * @param data The report data from the modal.
 */
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

/**
 * Deletes a specific report. Admin-only.
 */
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
    throw error; // Re-throw to be handled by the component
  }
};
export const submitReport = async (
  data: SubmitReportData
): Promise<SubmitReportResult> => {
  try {
    const submitReportFunction = httpsCallable<
      SubmitReportData,
      SubmitReportResult
    >(functions, "submitReport");

    const result = await toast.promise(submitReportFunction(data), {
      loading: "Submitting report...",
      success: "Report submitted! Thank you.",
      error: "Could not submit report.",
    });

    return result.data;
  } catch (error) {
    console.error("Error submitting report:", error);
    throw new Error("Failed to submit report.");
  }
};
