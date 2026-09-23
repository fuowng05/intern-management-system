export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface ApplicationResponse {
  id: string;

  studentId: string;
  studentName: string;
  studentEmail: string;

  periodId: string;
  periodCode: string;
  periodName: string;

  companyId: string;
  companyName: string;

  status: ApplicationStatus;

  decidedBy: string | null;
  decidedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface DecideApplicationRequest {
  decision: "APPROVED" | "REJECTED";
}

export interface CreateApplicationRequest {
  periodId: string;
  companyId: string;
}