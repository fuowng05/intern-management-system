export type CriteriaTemplateStatus =
  | "DRAFT"
  | "PUBLISHED";

export interface CriteriaTemplateItemResponse {
  id: string;
  name: string;
  defaultWeight: number;
  isMandatory: boolean;
  minPassScore: number | null;
  displayOrder: number;
}

export interface CriteriaTemplateResponse {
  id: string;
  periodId: string;
  periodCode: string;
  code: string;
  name: string;
  version: number;
  status: CriteriaTemplateStatus;
  minItems: number;
  maxItems: number;
  allowWeightEdit: boolean;
  weightTotal: number;
  issuedBy: string | null;
  issuedAt: string | null;
  items: CriteriaTemplateItemResponse[];
}

export interface CreateCriteriaTemplateRequest {
  periodId: string;
  code: string;
  name: string;
  minItems: number;
  maxItems: number;
  allowWeightEdit: boolean;
}

export interface AddCriteriaTemplateItemRequest {
  name: string;
  defaultWeight: number;
  isMandatory: boolean;
  minPassScore: number | null;
  displayOrder: number;
}
