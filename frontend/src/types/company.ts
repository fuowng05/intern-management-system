export interface CompanyResponse {
  id: string;
  name: string;
  taxCode: string;
  contactEmail: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  taxCode: string;
  contactEmail: string | null;
}

export interface UpdateCompanyRequest {
  name: string;
  taxCode: string;
  contactEmail: string | null;
  isActive: boolean;
}