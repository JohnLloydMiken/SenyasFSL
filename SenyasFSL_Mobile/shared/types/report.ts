// shared/types/report.ts

// The data sent FROM the app TO the cloud function
export interface SubmitReportData {
  reportType: string;
  description: string;
  // We'll add context on the frontend before sending
  levelId: string;
  currentStep: number;
}

// The data the cloud function sends BACK to the app
export interface SubmitReportResult {
  status: "success";
  reportId: string; // The ID of the new report document
}