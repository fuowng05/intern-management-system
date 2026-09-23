export type EvaluationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "RETURNED"
  | "PUBLISHED";

// ======================================================
// MENTOR / REVIEWER
// ======================================================

export interface EvaluationCriterionResponse {
  id: string;
  sourceItemId: string | null;
  name: string;
  weight: number;
  score: number | null;
  isMandatory: boolean;
  minPassScore: number | null;
  comment: string | null;
  displayOrder: number;
}

export interface EvaluationResponse {
  id: string;
  applicationId: string;

  studentId: string;
  studentName: string;

  companyId: string;
  companyName: string;

  templateId: string | null;
  templateName: string | null;

  mentorId: string;
  mentorName: string;

  reviewerId: string | null;

  status: EvaluationStatus;

  weightTotal: number;
  totalScore: number | null;

  classification: string | null;
  result: string | null;

  mentorComment: string | null;
  returnReason: string | null;

  version: number;
  rowVersion: number;

  submittedAt: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;

  criteria: EvaluationCriterionResponse[];
}

export interface UpdateCriterionRequest {
  score: number;
  comment: string | null;
  rowVersion: number;
}

export interface UpdateMentorCommentRequest {
  mentorComment: string | null;
  rowVersion: number;
}

export interface ReturnEvaluationRequest {
  reason: string;
  rowVersion: number;
}

export interface PublishEvaluationRequest {
  rowVersion: number;
}

// ======================================================
// STUDENT - PUBLISHED RESULT SNAPSHOT
// ======================================================

export interface PublishedCriterionSnapshot {
  Id: string;
  SourceItemId: string | null;
  Name: string;
  Weight: number;
  Score: number;
  IsMandatory: boolean;
  MinPassScore: number | null;
  Comment: string | null;
  DisplayOrder: number;
}

export interface PublishedEvaluationSnapshot {
  EvaluationId: string;
  Version: number;

  Application: {
    ApplicationId: string;
    StudentId: string;
    StudentName: string;
    CompanyId: string;
    CompanyName: string;
  };

  Template: {
    TemplateId: string | null;
    Name: string | null;
  };

  Mentor: {
    MentorId: string;
    Name: string;
  };

  Reviewer: {
    Id: string;
    FullName: string;
  };

  WeightTotal: number;
  TotalScore: number;
  Classification: string;
  Result: string;
  MentorComment: string | null;

  Criteria: PublishedCriterionSnapshot[];

  PublishedAt: string;
}

export interface PublishedEvaluationResponse {
  evaluationId: string;
  version: number;
  totalScore: number;
  classification: string;
  result: string;
  publishedAt: string;

  snapshot: PublishedEvaluationSnapshot;
}