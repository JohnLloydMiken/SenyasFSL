// packages/shared/src/types/report.ts

// --- Core Report Structure ---

/**
 * Defines the context object within a report.
 */
export interface ReportContext {
  userId: string;
  username: string;
  levelId: string;
  currentStep: number;
}

/**
 * Defines the structure of a single report document from Firestore.
 * Renamed to UserReport to avoid naming conflicts.
 */
export interface UserReport {
  id: string;
  reportType: string;
  description: string;
  context: ReportContext;
  // Timestamps from callable functions are serialized, so we expect this shape
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  status: "new" | "pending" | "resolved";
}

// --- API Types (Updated) ---

// For submitting a report (from user)
export interface SubmitReportData {
  reportType: string;
  description: string;
  levelId: string;
  currentStep: number;
}

export interface SubmitReportResult {
  status: "success";
  reportId: string;
}

// For getting reports (for admin)
export interface GetReportsData {}

export interface GetReportsResult {
  reports: UserReport[]; // Use the new UserReport type
}

// For updating a report's status (for admin)
export interface UpdateReportStatusData {
  reportId: string;
  newStatus: UserReport["status"]; // Use the status from our UserReport type
}
export interface UpdateReportStatusResult {
  status: "success";
}

// For deleting a report (for admin)
export interface DeleteReportData {
  reportId: string;
}
export interface DeleteReportResult {
  status: "success";
}
