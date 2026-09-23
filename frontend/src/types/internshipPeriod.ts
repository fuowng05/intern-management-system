export type InternshipPeriodStatus =
  | "DRAFT"
  | "OPEN"
  | "CLOSED";

export interface InternshipPeriodResponse {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: InternshipPeriodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInternshipPeriodRequest {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateInternshipPeriodRequest {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: InternshipPeriodStatus;
}