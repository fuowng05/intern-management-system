export interface ApplicationStatistics {
    pending: number;
    approved: number;
    rejected: number;
  }
  
  export interface EvaluationStatistics {
    total: number;
    draft: number;
    submitted: number;
    returned: number;
    published: number;
    passed: number;
    failed: number;
    averageScore: number | null;
  }
  
  export interface DashboardResponse {
    totalStudents: number;
    totalCompanies: number;
    totalApplications: number;
    totalAssignments: number;
    applications: ApplicationStatistics;
    evaluations: EvaluationStatistics;
  }